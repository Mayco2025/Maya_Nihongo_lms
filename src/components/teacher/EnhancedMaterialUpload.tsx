import React, { useState, useCallback, useRef } from 'react';
import { Material, User } from '../../types';
import { getFileUploadService, FILE_CONFIG, UploadProgress } from '../../services/fileUpload';
import { getSecureApi } from '../../services/secureApi';

interface EnhancedMaterialUploadProps {
  db: any;
  currentUser: User;
  onUploadComplete?: (material: Material) => void;
}

interface FileWithProgress {
  file: File;
  progress: UploadProgress;
  id: string;
}

const EnhancedMaterialUpload: React.FC<EnhancedMaterialUploadProps> = ({
  db,
  currentUser,
  onUploadComplete
}) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materialData, setMaterialData] = useState({
    lessonName: '',
    description: '',
    classGroup: '',
    accessLevel: 'students-only' as const,
    tags: [] as string[]
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithProgress[] = [];
    const fileUploadService = getFileUploadService();

    Array.from(selectedFiles).forEach(file => {
      // Validate file
      const validation = fileUploadService.validateFile(
        file,
        FILE_CONFIG.ALLOWED_TYPES.ALL,
        FILE_CONFIG.MAX_SIZES.DEFAULT
      );

      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      const fileWithProgress: FileWithProgress = {
        file,
        progress: { progress: 0, state: 'paused' },
        id: `${Date.now()}_${file.name}`
      };

      newFiles.push(fileWithProgress);
    });

    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-rose-500', 'bg-rose-50');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-rose-500', 'bg-rose-50');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-rose-500', 'bg-rose-50');
    }

    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const updateFileProgress = useCallback((fileId: string, progress: UploadProgress) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, progress } : f
    ));
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }

    if (!materialData.lessonName.trim()) {
      setError('Please enter a lesson name');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileUploadService = getFileUploadService();
      const secureApi = getSecureApi(db);
      secureApi.setUser(currentUser);

      const uploadPromises = files.map(async (fileWithProgress) => {
        const { file, id } = fileWithProgress;
        
        // Generate file path
        const filePath = fileUploadService.generateFilePath(
          file.name,
          currentUser.uid,
          materialData.classGroup || undefined
        );

        // Upload file with progress tracking
        const downloadURL = await fileUploadService.uploadFile(
          file,
          filePath,
          (progress) => updateFileProgress(id, progress)
        );

        // Create material record
        const materialDataToSave: Partial<Material> = {
          lessonName: materialData.lessonName,
          description: materialData.description,
          classGroup: materialData.classGroup || 'general',
          fileUrl: downloadURL,
          fileType: getFileType(file.type),
          fileSize: file.size,
          accessLevel: materialData.accessLevel,
          tags: materialData.tags,
          isActive: true
        };

        const materialId = await secureApi.uploadMaterial(materialDataToSave);
        
        return {
          id: materialId,
          ...materialDataToSave
        } as Material;
      });

      const uploadedMaterials = await Promise.all(uploadPromises);
      
      // Call completion callback
      uploadedMaterials.forEach(material => {
        onUploadComplete?.(material);
      });

      // Reset form
      setFiles([]);
      setMaterialData({
        lessonName: '',
        description: '',
        classGroup: '',
        accessLevel: 'students-only',
        tags: []
      });

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getFileType = (mimeType: string): Material['fileType'] => {
    if (FILE_CONFIG.ALLOWED_TYPES.IMAGES.includes(mimeType)) return 'image';
    if (FILE_CONFIG.ALLOWED_TYPES.DOCUMENTS.includes(mimeType)) return 'pdf';
    if (FILE_CONFIG.ALLOWED_TYPES.PRESENTATIONS.includes(mimeType)) return 'ppt';
    if (FILE_CONFIG.ALLOWED_TYPES.AUDIO.includes(mimeType)) return 'audio';
    if (FILE_CONFIG.ALLOWED_TYPES.VIDEO.includes(mimeType)) return 'video';
    return 'pdf';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getProgressColor = (state: UploadProgress['state']) => {
    switch (state) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'running': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-slate-200/80">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload Course Materials</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Material Information Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lesson Name *
            </label>
            <input
              type="text"
              value={materialData.lessonName}
              onChange={(e) => setMaterialData(prev => ({ ...prev, lessonName: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Enter lesson name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Class Group
            </label>
            <input
              type="text"
              value={materialData.classGroup}
              onChange={(e) => setMaterialData(prev => ({ ...prev, classGroup: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="e.g., N5-Beginners"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={materialData.description}
              onChange={(e) => setMaterialData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              rows={3}
              placeholder="Describe the lesson content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Access Level
            </label>
            <select
              value={materialData.accessLevel}
              onChange={(e) => setMaterialData(prev => ({ ...prev, accessLevel: e.target.value as any }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="public">Public - All students</option>
              <option value="students-only">Students Only</option>
              <option value="class-specific">Class Specific</option>
              <option value="teacher-only">Teachers Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={materialData.tags.join(', ')}
              onChange={(e) => setMaterialData(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="grammar, vocabulary, kanji (comma separated)"
            />
          </div>
        </div>

        {/* File Upload Area */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center transition-colors hover:border-rose-400 hover:bg-rose-50/50"
        >
          <div className="space-y-4">
            <div className="text-slate-500">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-slate-700">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Supports PDF, PPT, DOC, images, audio, and video files (max 10MB each)
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={FILE_CONFIG.ALLOWED_TYPES.ALL.join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-slate-700 mb-3">Selected Files</h4>
            <div className="space-y-3">
              {files.map((fileWithProgress) => (
                <div key={fileWithProgress.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-slate-500">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{fileWithProgress.file.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(fileWithProgress.file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Progress Bar */}
                    <div className="w-24">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(fileWithProgress.progress.state)}`}
                          style={{ width: `${fileWithProgress.progress.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Status */}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      fileWithProgress.progress.state === 'success' ? 'bg-green-100 text-green-800' :
                      fileWithProgress.progress.state === 'error' ? 'bg-red-100 text-red-800' :
                      fileWithProgress.progress.state === 'running' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {fileWithProgress.progress.state}
                    </span>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(fileWithProgress.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={uploading}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMaterialUpload; 