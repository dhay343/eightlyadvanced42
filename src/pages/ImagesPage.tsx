import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageArea } from '../components/ImageArea';
import { getProjectData, updateProjectImages } from '../services/firestore';
import { Plus, Settings, ArrowLeft, Image as ImageIcon, Sparkles } from 'lucide-react';

export const ImagesPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [showImageAreas, setShowImageAreas] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (code) {
      loadProjectData();
    }
  }, [code]);

  const loadProjectData = async () => {
    if (!code) return;
    setIsLoading(true);
    try {
      const data = await getProjectData(code);
      setImages(data.images);
      setShowImageAreas(data.images.length > 0);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = () => {
    setShowImageAreas(true);
    const newImages = [...images, ''];
    setImages(newImages);
    updateProjectImages(code!, newImages);
  };

  const updateImage = (index: number, image: string) => {
    const newImages = [...images];
    newImages[index] = image;
    setImages(newImages);
    updateProjectImages(code!, newImages);
  };

  const deleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    updateProjectImages(code!, newImages);
    if (newImages.length === 0) {
      setShowImageAreas(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-white/60 text-sm md:text-base">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl floating" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 md:w-80 md:h-80 bg-purple-500/5 rounded-full blur-3xl floating-delayed" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 min-h-screen p-4 md:p-6 safe-area-top safe-area-bottom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-white/60 hover:text-white touch-target"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Image Vault</h1>
                    <p className="text-white/60 text-xs md:text-sm">Code: <span className="font-mono text-primary">{code}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/background/${code}`)}
              className="group w-full sm:w-auto px-4 py-3 md:px-6 md:py-3 bg-gradient-secondary rounded-xl text-white font-semibold btn-premium flex items-center justify-center gap-3 touch-target"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-300" />
              Background Settings
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8 animate-slide-up">
            <div className="card-premium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">{images.length}</p>
                  <p className="text-white/60 text-xs md:text-sm">Total Images</p>
                </div>
              </div>
            </div>
            
            <div className="card-premium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">{images.filter(img => img.trim()).length}</p>
                  <p className="text-white/60 text-xs md:text-sm">Uploaded</p>
                </div>
              </div>
            </div>
            
            <div className="card-premium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">{images.filter(img => !img.trim()).length}</p>
                  <p className="text-white/60 text-xs md:text-sm">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Image Button */}
          <div className="text-center mb-6 md:mb-8 animate-slide-up">
            <button
              onClick={addImage}
              className="group w-full sm:w-auto px-6 py-4 md:px-8 md:py-4 bg-gradient-primary rounded-2xl text-white font-semibold text-base md:text-lg btn-premium flex items-center justify-center gap-3 mx-auto touch-target"
            >
              <Plus className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
              Add New Image
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Images Grid */}
          {showImageAreas && (
            <div className="space-y-4 md:space-y-6 animate-fade-in">
              <div className="grid gap-4 md:gap-6">
                {images.map((image, index) => (
                  <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ImageArea
                      image={image}
                      onImageChange={(newImage) => updateImage(index, newImage)}
                      onDelete={() => deleteImage(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!showImageAreas && (
            <div className="text-center py-12 md:py-16 animate-fade-in">
              <div className="card-premium max-w-md mx-auto">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Images Yet</h3>
                <p className="text-white/60 mb-6 text-sm md:text-base">Start building your image vault by adding your first image.</p>
                <button
                  onClick={addImage}
                  className="px-6 py-3 bg-gradient-primary rounded-xl text-white font-semibold btn-premium touch-target"
                >
                  Add First Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};