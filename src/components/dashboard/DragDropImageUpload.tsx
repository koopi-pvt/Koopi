'use client';

import React, { useState, useRef, DragEvent } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, GripVertical } from 'lucide-react';

type DragDropImageUploadProps = {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
  onUpload: (files: FileList) => void;
  uploading: boolean;
};

export function DragDropImageUpload({ 
  imageUrls, 
  onImagesChange, 
  onUpload,
  uploading 
}: DragDropImageUploadProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleFileDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleFileDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleImageDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newImages = [...imageUrls];
      const [removed] = newImages.splice(draggedIndex, 1);
      newImages.splice(dragOverIndex, 0, removed);
      onImagesChange(newImages);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const removeImage = (index: number) => {
    onImagesChange(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleImageDragStart(index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleImageDragEnd}
              className={`relative group cursor-move transition-all ${
                draggedIndex === index ? 'opacity-50 scale-95' : ''
              } ${
                dragOverIndex === index && draggedIndex !== index 
                  ? 'ring-4 ring-blue-400 scale-105' 
                  : ''
              }`}
            >
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 z-10 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <GripVertical className="h-4 w-4 text-gray-600" />
              </div>

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                  PRIMARY
                </div>
              )}

              {/* Image */}
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image Number */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-lg">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleFileDrop}
        onDragOver={handleFileDragOver}
        onDragLeave={handleFileDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDraggingFile
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {uploading ? (
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
          ) : isDraggingFile ? (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 animate-pulse">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
          )}
          <span className="text-base font-semibold text-gray-700 mb-2">
            {uploading 
              ? 'Uploading images...' 
              : isDraggingFile
              ? 'Drop images here!'
              : 'Drag & drop images or click to browse'
            }
          </span>
          <span className="text-sm text-gray-500">
            {isDraggingFile 
              ? 'Release to upload' 
              : 'PNG, JPG, GIF up to 10MB each'
            }
          </span>
          {imageUrls.length > 0 && !uploading && !isDraggingFile && (
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Drag images to reorder. First image is the primary image.</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
