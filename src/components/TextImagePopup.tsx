import React, { useState, useEffect } from 'react';
import { X, Plus, Image as ImageIcon, Check } from 'lucide-react';
import { ImageArea } from './ImageArea';

interface TextImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (images: string[]) => void;
  existingImages: string[];
  textIndex: number;
}

export const TextImagePopup: React.FC<TextImagePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  existingImages,
  textIndex
}) => {
  const [images, setImages] = useState<string[]>(existingImages);

  useEffect(() => {
    if (isOpen) {
      setImages(existingImages);
    }
  }, [isOpen, existingImages]);

  if (!isOpen) return null;

  const addImage = () => {
    setImages([...images, '']);
  };

  const updateImage = (index: number, image: string) => {
    const newImages = [...images];
    newImages[index] = image;
    setImages(newImages);
  };

  const deleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSave = () => {
    onSave(images.filter(img => img.trim()));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-premium w-full max-w-6xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Manage Images</h2>
              <p className="text-white/60 text-sm">Text Option #{textIndex + 1}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSave} 
              className="px-6 py-3 bg-gradient-success rounded-xl text-white font-semibold btn-premium flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Add Image Button */}
        <div className="p-6 border-b border-white/10">
          <button
            onClick={addImage}
            className="group px-6 py-3 bg-gradient-primary rounded-xl text-white font-semibold btn-premium flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Add New Image
          </button>
        </div>

        {/* Images Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {images.length > 0 ? (
            <div className="space-y-6">
              {images.map((image, index) => (
                <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-medium text-sm">{index + 1}</span>
                    </div>
                    <h3 className="text-white font-medium">Image {index + 1}</h3>
                  </div>
                  <ImageArea
                    image={image}
                    onImageChange={(newImage) => updateImage(index, newImage)}
                    onDelete={() => deleteImage(index)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Images Yet</h3>
              <p className="text-white/60 mb-6">Add images to associate with this text option.</p>
              <button
                onClick={addImage}
                className="px-6 py-3 bg-gradient-primary rounded-xl text-white font-semibold btn-premium"
              >
                Add First Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};