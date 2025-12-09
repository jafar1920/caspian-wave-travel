// Image Upload Manager - UPDATED WITH BACKWARD COMPATIBILITY
const ImageUpload = {
    storage: null,
    
    init() {
        if (!firebase.apps.length) {
            console.error('Firebase not initialized');
            return;
        }
        
        this.storage = firebase.storage();
        console.log('✅ Image Upload initialized');
    },
    
    // =================== MAIN UPLOAD FUNCTION ===================
    async uploadImage(file, tourId, options = {}) {
        return new Promise((resolve, reject) => {
            if (!file || !tourId) {
                reject('No file or tourId provided');
                return;
            }
            
            // OPTIMIZATION: Skip compression for small files
            const maxSizeForCompression = 2 * 1024 * 1024; // 2MB
            let fileToUpload = file;
            
            // Only compress if file is large
            if (file.size > maxSizeForCompression && this.compressImage) {
                this.compressImage(file, 1600, 0.7).then(compressedFile => {
                    fileToUpload = compressedFile;
                    this.doUpload(fileToUpload, tourId, options, resolve, reject);
                }).catch(() => {
                    this.doUpload(file, tourId, options, resolve, reject);
                });
            } else {
                this.doUpload(file, tourId, options, resolve, reject);
            }
        });
    },
    
    // =================== UPLOAD LOGIC ===================
    doUpload(file, tourId, options, resolve, reject) {
        try {
            // Validate file first
            this.validateFile(file);
        } catch (validationError) {
            reject(validationError);
            return;
        }
        
        // Create filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substr(2, 9);
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `img_${timestamp}_${randomStr}.${fileExt}`;
        
        // =================== KEY CHANGE: ORGANIZED STORAGE PATH ===================
        // Options can specify type ('tour' or 'package'), defaults to 'tour' for backward compatibility
        const itemType = options.type || 'tour';
        const storagePath = this.getStoragePath(fileName, tourId, itemType);
        // =================== END OF KEY CHANGE ===================
        
        // Upload
        const storageRef = this.storage.ref(storagePath);
        const metadata = {
            contentType: file.type,
            customMetadata: {
                originalName: file.name,
                tourId: tourId,
                itemType: itemType,
                uploadTime: new Date().toISOString()
            }
        };
        
        const uploadTask = storageRef.put(file, metadata);
        
        uploadTask.on('state_changed',
            null,
            (error) => reject(error),
            async () => {
                try {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    },
    
    // =================== NEW: GET ORGANIZED STORAGE PATH ===================
    getStoragePath(fileName, itemId, itemType = 'tour') {
        // Create organized path based on item type
        const folder = itemType === 'package' ? 'packages' : 'tours';
        return `${folder}/${itemId}/images/${fileName}`;
        
        // Old path (for reference): `tours/${tourId}/images/${fileName}`
        // New path examples:
        // - Tours: `tours/{tour-id}/images/{filename}`
        // - Packages: `packages/{package-id}/images/{filename}`
    },
    
    // =================== VALIDATION ===================
    validateFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error(`File type not allowed: ${file.type}. Allowed: JPEG, PNG, GIF, WebP`);
        }
        
        if (file.size > maxSize) {
            throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 5MB`);
        }
        
        return true;
    },
    
    // =================== MULTIPLE IMAGES (WITH BACKWARD COMPATIBILITY) ===================
    async uploadMultipleImages(files, tourId, options = {}) {
        if (!files || files.length === 0) {
            return [];
        }
        
        const uploadPromises = [];
        for (let i = 0; i < files.length; i++) {
            // Pass options to each upload
            uploadPromises.push(this.uploadImage(files[i], tourId, options));
        }
        
        try {
            const urls = await Promise.all(uploadPromises);
            return urls;
        } catch (error) {
            console.error('❌ Error uploading multiple images:', error);
            throw error;
        }
    },
    
    // =================== DELETE IMAGE (BACKWARD COMPATIBLE) ===================
    async deleteImage(imageUrl) {
        try {
            console.log('🗑️ Attempting to delete image:', imageUrl);
            
            // Extract the storage path from the URL
            let storagePath = '';
            
            // Handle Firebase Storage URLs
            if (imageUrl.includes('firebasestorage.googleapis.com')) {
                try {
                    const urlObj = new URL(imageUrl);
                    const pathname = urlObj.pathname;
                    
                    // Pattern: /v0/b/bucket-name.appspot.com/o/encoded-path
                    const match = pathname.match(/\/o\/(.+)$/);
                    if (match && match[1]) {
                        storagePath = decodeURIComponent(match[1]);
                    }
                } catch (e) {
                    console.warn('Error parsing Firebase URL:', e);
                }
            }
            
            // If still no path, try alternative parsing
            if (!storagePath) {
                console.warn('Could not parse URL with standard method, trying alternative...');
                
                // Remove protocol and domain
                let path = imageUrl.replace(/https?:\/\//, '');
                
                // Remove everything up to /o/
                const oIndex = path.indexOf('/o/');
                if (oIndex !== -1) {
                    path = path.substring(oIndex + 3); // +3 to skip "/o/"
                    
                    // Remove query parameters
                    const queryIndex = path.indexOf('?');
                    if (queryIndex !== -1) {
                        path = path.substring(0, queryIndex);
                    }
                    
                    // Decode URI components
                    storagePath = decodeURIComponent(path);
                }
            }
            
            // Validate the path
            if (!storagePath) {
                console.error('❌ Could not extract storage path from URL:', imageUrl);
                return false;
            }
            
            console.log('📁 Extracted storage path:', storagePath);
            
            // Delete the file
            const imageRef = this.storage.ref(storagePath);
            await imageRef.delete();
            
            console.log('✅ Image deleted successfully from storage');
            return true;
            
        } catch (error) {
            console.error('❌ Error deleting image from storage:', error);
            console.error('Image URL was:', imageUrl);
            console.error('Error details:', error.message);
            return false;
        }
    },
    
    // =================== NEW: DELETE ENTIRE FOLDER ===================
    async deleteItemFolder(itemId, itemType = 'tour') {
        try {
            const folderPath = itemType === 'package' ? `packages/${itemId}` : `tours/${itemId}`;
            
            console.log(`🗑️ Deleting folder: ${folderPath}`);
            
            const folderRef = this.storage.ref().child(folderPath);
            
            // Try to list and delete everything in the folder
            try {
                const listResult = await folderRef.listAll();
                
                // Delete all files
                const deletePromises = [];
                listResult.items.forEach(itemRef => {
                    deletePromises.push(itemRef.delete());
                });
                
                // Delete files in subfolders
                for (const prefix of listResult.prefixes) {
                    const subFolderResult = await prefix.listAll();
                    subFolderResult.items.forEach(itemRef => {
                        deletePromises.push(itemRef.delete());
                    });
                }
                
                await Promise.all(deletePromises);
                console.log(`✅ Successfully deleted folder: ${folderPath}`);
                
            } catch (listError) {
                // Folder might not exist or be empty
                console.log(`📁 Folder ${folderPath} might not exist or is empty:`, listError.message);
            }
            
            return true;
            
        } catch (error) {
            console.error(`❌ Error deleting folder for ${itemType} ${itemId}:`, error);
            return false;
        }
    },
    
    // =================== COMPRESSION (UNCHANGED) ===================
    compressImage(file, maxWidth = 1920, quality = 0.8) {
        return new Promise((resolve, reject) => {
            // Only compress images
            if (!file.type.match('image.*')) {
                resolve(file);
                return;
            }
            
            // Skip if file is already small (< 1MB)
            if (file.size < 1024 * 1024) {
                resolve(file);
                return;
            }
            
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Resize if too large
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob(
                        (blob) => {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            
                            console.log(`📊 Compression: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        quality
                    );
                };
                
                img.onerror = () => {
                    console.warn('Image compression failed, using original');
                    resolve(file);
                };
            };
            
            reader.onerror = () => {
                console.warn('File reading failed, using original');
                resolve(file);
            };
        });
    }
};

window.ImageUpload = ImageUpload;