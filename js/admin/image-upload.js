// Image Upload Manager
const ImageUpload = {
    storage: null,
    
    init() {
        if (!firebase.apps.length) {
            console.error('Firebase not initialized');
            return;
        }
        
        this.storage = firebase.storage();
        console.log('Image Upload initialized');
    },
    
    // Upload a single image
    async uploadImage(file, tourId) {
        return new Promise((resolve, reject) => {
            if (!file || !tourId) {
                reject('No file or tourId provided');
                return;
            }
            
            // Create a unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `tour_${tourId}_${Date.now()}.${fileExt}`;
            const storagePath = `tour-images/${fileName}`;
            
            // Create storage reference
            const storageRef = this.storage.ref(storagePath);
            const uploadTask = storageRef.put(file);
            
            // Monitor upload progress
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progress monitoring (optional)
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error('Upload error:', error);
                    reject(error);
                },
                async () => {
                    // Upload complete, get download URL
                    try {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        reject(error);
                    }
                }
            );
        });
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
            console.error('Error uploading multiple images:', error);
            throw error;
        }
    },
    
    // Delete an image from storage - UPDATED
    async deleteImage(imageUrl) {
        try {
            // Extract the path from the URL
            console.log('Deleting image:', imageUrl);
            
            // Try to extract path from Firebase Storage URL
            let path = '';
            
            if (imageUrl.includes('firebasestorage.googleapis.com')) {
                // Firebase Storage URL format
                const urlParts = imageUrl.split('/o/');
                if (urlParts.length > 1) {
                    path = decodeURIComponent(urlParts[1].split('?')[0]);
                }
            } else {
                // Try to extract from query string or path
                const url = new URL(imageUrl);
                const pathname = url.pathname;
                
                // Remove leading slash and any query parameters
                path = pathname.replace(/^\//, '').split('?')[0];
            }
            
            if (!path) {
                console.error('Could not extract path from URL:', imageUrl);
                return false;
            }
            
            console.log('Extracted path:', path);
            
            // Create storage reference and delete
            const imageRef = this.storage.ref(path);
            await imageRef.delete();
            console.log('Image deleted successfully from storage');
            return true;
            
        } catch (error) {
            console.error('Error deleting image from storage:', error);
            console.error('Image URL was:', imageUrl);
            return false;
        }
    }
};

window.ImageUpload = ImageUpload;