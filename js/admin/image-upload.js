// Image Upload Manager
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
    
    // Upload a single image with organized storage
    // In image-upload.js, update the uploadImage function:
async uploadImage(file, tourId) {
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
            // Optional: Add compression for large files
            this.compressImage(file, 1600, 0.7).then(compressedFile => {
                fileToUpload = compressedFile;
                this.doUpload(fileToUpload, tourId, resolve, reject);
            }).catch(() => {
                // If compression fails, use original
                this.doUpload(file, tourId, resolve, reject);
            });
        } else {
            this.doUpload(file, tourId, resolve, reject);
        }
    });
},

// Separate upload logic
doUpload(file, tourId, resolve, reject) {
    // Create filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `img_${timestamp}_${randomStr}.${fileExt}`;
    
    // Storage path
    const storagePath = `tours/${tourId}/images/${fileName}`;
    
    // Upload
    const storageRef = this.storage.ref(storagePath);
    const metadata = {
        contentType: file.type,
        customMetadata: {
            originalName: file.name,
            tourId: tourId
        }
    };
    
    const uploadTask = storageRef.put(file, metadata);
    
    uploadTask.on('state_changed',
        null, // No progress callback (handled by UI)
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
    
    // Upload multiple images
    async uploadMultipleImages(files, tourId) {
        if (!files || files.length === 0) {
            return [];
        }
        
        const uploadPromises = [];
        for (let i = 0; i < files.length; i++) {
            uploadPromises.push(this.uploadImage(files[i], tourId));
        }
        
        try {
            const urls = await Promise.all(uploadPromises);
            return urls;
        } catch (error) {
            console.error('❌ Error uploading multiple images:', error);
            throw error;
        }
    },
    
    // Delete an image from storage - FIXED VERSION
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
    
    // Optional: Compress image before upload (client-side)
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