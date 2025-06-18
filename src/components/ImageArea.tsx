import React, { useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon, Copy, Download } from 'lucide-react';

interface ImageAreaProps {
  image?: string;
  onImageChange: (image: string) => void;
  onDelete: () => void;
}

export const ImageArea: React.FC<ImageAreaProps> = ({ image, onImageChange, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSelected, setIsSelected] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleClick = () => {
    setIsSelected(true);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              onImageChange(e.target.result as string);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const copyToClipboard = async () => {
    if (image) {
      try {
        await navigator.clipboard.writeText(image);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy image to clipboard:', err);
      }
    }
  };

  const downloadImage = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = `image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="card-premium group">
      <div
        className={`relative min-h-64 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-primary bg-primary/10 scale-105'
            : isSelected
            ? 'border-primary/50 bg-primary/5'
            : 'border-white/20 hover:border-white/40'
        }`}
        onClick={handleClick}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        tabIndex={0}
        className="focus-premium"
      >
        {image ? (
          <div className="relative h-full">
            <img 
              src={image} 
              alt="Uploaded" 
              className="w-full h-full object-contain rounded-xl"
            />
            
            {/* Image Overlay Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 rounded-xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard();
                }}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors duration-200"
                title="Copy to clipboard"
              >
                <Copy className="w-5 h-5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage();
                }}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors duration-200"
                title="Download image"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileUpload();
                }}
                className="p-3 bg-primary/80 hover:bg-primary rounded-xl text-white transition-colors duration-200"
                title="Replace image"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
              isDragging ? 'bg-primary scale-110' : 'bg-white/10'
            }`}>
              <ImageIcon className={`w-8 h-8 transition-colors duration-300 ${
                isDragging ? 'text-white' : 'text-white/60'
              }`} />
            </div>
            
            {isSelected ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Upload</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Paste an image (Ctrl+V) or click the button below
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileUpload();
                  }}
                  className="px-6 py-3 bg-gradient-primary rounded-xl text-white font-semibold btn-premium flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Add Image</h3>
                <p className="text-white/60 text-sm">
                  Click to select, then paste or upload your image
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Delete Button */}
      {image && (
        <div className="flex justify-end mt-4">
          <button
            onClick={onDelete}
            className="group/delete px-4 py-2 bg-red-500/20 hover:bg-red-500 rounded-xl text-red-400 hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform duration-200" />
            Delete
          </button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};