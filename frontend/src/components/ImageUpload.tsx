import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  accept?: string;
}

export default function ImageUpload({ value, onChange, label, accept = "image/*,video/*" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = response.data.url;
      setPreview(url);
      onChange(url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
  };

  const isVideo = preview && (preview.endsWith('.mp4') || preview.endsWith('.webm') || preview.endsWith('.mov'));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {preview ? (
        <div className="relative">
          {isVideo ? (
            <video src={preview} className="w-full h-48 object-cover rounded-lg" controls />
          ) : (
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload image or video</p>
                <p className="text-xs text-gray-400 mt-1">Max size: 10MB</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
