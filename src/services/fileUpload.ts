import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../utils/firebase';

export interface UploadProgress {
  progress: number;
  state: 'paused' | 'running' | 'success' | 'error';
  downloadURL?: string;
  error?: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  path: string;
}

export class FileUploadService {
  private storage: any;

  constructor(storageInstance: any) {
    this.storage = storageInstance;
  }

  // Upload file with progress tracking
  async uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(this.storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.({
            progress,
            state: snapshot.state as 'paused' | 'running' | 'success' | 'error'
          });
        },
        (error) => {
          console.error('Upload error:', error);
          onProgress?.({
            progress: 0,
            state: 'error',
            error: error.message
          });
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress?.({
              progress: 100,
              state: 'success',
              downloadURL
            });
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[],
    basePath: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${basePath}/${fileName}`;
      
      return this.uploadFile(file, filePath, (progress) => {
        onProgress?.(index, progress);
      });
    });

    return Promise.all(uploadPromises);
  }

  // Delete file
  async deleteFile(path: string): Promise<void> {
    try {
      const fileRef = ref(this.storage, path);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // List files in a directory
  async listFiles(path: string): Promise<FileMetadata[]> {
    try {
      const listRef = ref(this.storage, path);
      const result = await listAll(listRef);
      
      return result.items.map(item => ({
        name: item.name,
        size: 0, // Would need to get metadata for actual size
        type: 'file',
        lastModified: Date.now(),
        path: item.fullPath
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // Get file download URL
  async getDownloadURL(path: string): Promise<string> {
    try {
      const fileRef = ref(this.storage, path);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  // Validate file type and size
  validateFile(file: File, allowedTypes: string[], maxSize: number): { valid: boolean; error?: string } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file size (maxSize in bytes)
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        valid: false,
        error: `File size ${Math.round(file.size / (1024 * 1024))}MB exceeds maximum allowed size of ${maxSizeMB}MB`
      };
    }

    return { valid: true };
  }

  // Generate unique file path
  generateFilePath(fileName: string, userId: string, classId?: string): string {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    if (classId) {
      return `users/${userId}/classes/${classId}/materials/${timestamp}_${sanitizedFileName}`;
    }
    
    return `users/${userId}/materials/${timestamp}_${sanitizedFileName}`;
  }
}

// File type configurations
export const FILE_CONFIG = {
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    PRESENTATIONS: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
    VIDEO: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'],
    ALL: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
      'video/mp4', 'video/webm', 'video/ogg', 'video/avi'
    ]
  },
  MAX_SIZES: {
    IMAGE: 5 * 1024 * 1024, // 5MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    AUDIO: 50 * 1024 * 1024, // 50MB
    VIDEO: 100 * 1024 * 1024, // 100MB
    DEFAULT: 10 * 1024 * 1024 // 10MB
  }
};

// Export singleton instance
let fileUploadInstance: FileUploadService | null = null;

export const getFileUploadService = (storageInstance?: any): FileUploadService => {
  if (!fileUploadInstance && storageInstance) {
    fileUploadInstance = new FileUploadService(storageInstance);
  }
  if (!fileUploadInstance) {
    throw new Error('FileUploadService not initialized. Call with storage instance first.');
  }
  return fileUploadInstance;
}; 