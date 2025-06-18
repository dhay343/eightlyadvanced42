import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, ArrowLeft, ArrowRight, Trash2, Settings, Image as ImageIcon, Layers, AlertTriangle } from 'lucide-react';
import { TemplateCreatePopup } from '../components/TemplateCreatePopup';
import { TextImagePopup } from '../components/TextImagePopup';
import { getProjectData, updateProjectTemplates, deleteProject } from '../services/firestore';
import { Template } from '../types';

export const BackgroundPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
  const [selectedTemplateForImages, setSelectedTemplateForImages] = useState<number | null>(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
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
      const templatesWithImages = data.templates.map(template => ({
        ...template,
        textImages: template.textImages || {}
      }));
      setTemplates(templatesWithImages);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = (texts: string[], selectedIndex: number) => {
    if (editingTemplate !== null) {
      const newTemplates = [...templates];
      newTemplates[editingTemplate] = {
        ...newTemplates[editingTemplate],
        texts,
        selectedIndex,
        textImages: newTemplates[editingTemplate].textImages || {}
      };
      setTemplates(newTemplates);
      updateProjectTemplates(code!, newTemplates);
    } else {
      const newTemplate: Template = {
        id: templates.length + 1,
        texts,
        selectedIndex,
        textImages: {}
      };
      let newTemplates;
      if (insertionIndex !== null) {
        newTemplates = [
          ...templates.slice(0, insertionIndex + 1),
          newTemplate,
          ...templates.slice(insertionIndex + 1)
        ];
      } else {
        newTemplates = [...templates, newTemplate];
      }
      const renumberedTemplates = newTemplates.map((template, i) => ({
        ...template,
        id: i + 1
      }));
      setTemplates(renumberedTemplates);
      updateProjectTemplates(code!, renumberedTemplates);
    }
    setEditingTemplate(null);
    setInsertionIndex(null);
  };

  const deleteTemplate = (index: number) => {
    const newTemplates = templates.filter((_, i) => i !== index);
    const renumberedTemplates = newTemplates.map((template, i) => ({
      ...template,
      id: i + 1
    }));
    setTemplates(renumberedTemplates);
    updateProjectTemplates(code!, renumberedTemplates);
  };

  const navigateText = (templateIndex: number, direction: 'prev' | 'next') => {
    const template = templates[templateIndex];
    let newIndex = template.selectedIndex;
    
    if (direction === 'prev') {
      newIndex = newIndex > 0 ? newIndex - 1 : 0;
    } else {
      newIndex = newIndex < template.texts.length - 1 ? newIndex + 1 : template.texts.length - 1;
    }

    const newTemplates = [...templates];
    newTemplates[templateIndex] = { ...template, selectedIndex: newIndex };
    setTemplates(newTemplates);
    updateProjectTemplates(code!, newTemplates);
  };

  const editTemplate = (index: number) => {
    setEditingTemplate(index);
    setShowCreatePopup(true);
  };

  const createNewTemplate = (afterIndex?: number) => {
    setEditingTemplate(null);
    setShowCreatePopup(true);
    if (afterIndex !== undefined) {
      setInsertionIndex(afterIndex);
    } else {
      setInsertionIndex(null);
    }
  };

  const openImageManager = (templateIndex: number, textIndex: number) => {
    setSelectedTemplateForImages(templateIndex);
    setSelectedTextIndex(textIndex);
    setShowImagePopup(true);
  };

  const saveTemplateImages = (images: string[]) => {
    if (selectedTemplateForImages !== null && selectedTextIndex !== null) {
      const newTemplates = [...templates];
      const template = newTemplates[selectedTemplateForImages];
      template.textImages = {
        ...template.textImages,
        [selectedTextIndex]: images
      };
      setTemplates(newTemplates);
      updateProjectTemplates(code!, newTemplates);
    }
    setSelectedTemplateForImages(null);
    setSelectedTextIndex(null);
  };

  const handleDeleteProject = async () => {
    if (!code) return;
    try {
      await deleteProject(code);
      navigate('/');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-white/60 text-sm md:text-base">Loading background templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/5 rounded-full blur-3xl floating" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 md:w-80 md:h-80 bg-primary/5 rounded-full blur-3xl floating-delayed" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 min-h-screen p-4 md:p-6 safe-area-top safe-area-bottom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                    <Layers className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Background Templates</h1>
                    <p className="text-white/60 text-xs md:text-sm">Code: <span className="font-mono text-primary">{code}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/images/${code}`)}
                className="group px-4 py-3 md:px-6 md:py-3 glass rounded-xl text-white font-semibold btn-premium flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 touch-target"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Images
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="group px-4 py-3 md:px-6 md:py-3 bg-gradient-warning rounded-xl text-white font-semibold btn-premium flex items-center justify-center gap-3 touch-target"
              >
                <Trash2 className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-300" />
                Delete Project
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8 animate-slide-up">
            <div className="card-premium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Layers className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">{templates.length}</p>
                  <p className="text-white/60 text-xs md:text-sm">Total Templates</p>
                </div>
              </div>
            </div>
            
            <div className="card-premium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">{templates.reduce((acc, t) => acc + t.texts.length, 0)}</p>
                  <p className="text-white/60 text-xs md:text-sm">Total Texts</p>
                </div>
              </div>
            </div>
            
            <div className="card-premium">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">
                    {templates.reduce((acc, t) => acc + Object.keys(t.textImages || {}).length, 0)}
                  </p>
                  <p className="text-white/60 text-xs md:text-sm">Text Images</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Template Button */}
          <div className="text-center mb-6 md:mb-8 animate-slide-up">
            <button
              onClick={() => createNewTemplate()}
              className="group w-full sm:w-auto px-6 py-4 md:px-8 md:py-4 bg-gradient-accent rounded-2xl text-white font-semibold text-base md:text-lg btn-premium flex items-center justify-center gap-3 mx-auto touch-target"
            >
              <Plus className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
              Create New Template
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Templates List */}
          <div className="space-y-4 md:space-y-6 animate-fade-in">
            {templates.map((template, templateIndex) => (
              <div key={template.id} className="space-y-4" style={{ animationDelay: `${templateIndex * 0.1}s` }}>
                <div className="card-premium group">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Template Number */}
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm md:text-base">#{template.id}</span>
                    </div>

                    {/* Current Text Display */}
                    <button
                      onClick={() => openImageManager(templateIndex, template.selectedIndex)}
                      className="flex-1 text-left p-3 md:p-4 glass rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 group/text touch-target"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white group-hover/text:text-primary transition-colors duration-300 text-sm md:text-base break-words">
                          {template.texts[template.selectedIndex] || 'Empty text'}
                        </span>
                        <div className="flex items-center gap-2 text-white/40 flex-shrink-0 ml-2">
                          <span className="text-xs">
                            {template.selectedIndex + 1} of {template.texts.length}
                          </span>
                          {template.textImages[template.selectedIndex]?.length > 0 && (
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <button
                        onClick={() => navigateText(templateIndex, 'prev')}
                        disabled={template.selectedIndex === 0}
                        className={`p-2 md:p-3 rounded-xl transition-all duration-300 touch-target ${
                          template.selectedIndex === 0
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-primary/20 text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => navigateText(templateIndex, 'next')}
                        disabled={template.selectedIndex === template.texts.length - 1}
                        className={`p-2 md:p-3 rounded-xl transition-all duration-300 touch-target ${
                          template.selectedIndex === template.texts.length - 1
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-primary/20 text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <button
                        onClick={() => editTemplate(templateIndex)}
                        className="p-2 md:p-3 bg-yellow-500/20 hover:bg-yellow-500 rounded-xl text-yellow-400 hover:text-white transition-all duration-300 touch-target"
                        title="Edit template"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteTemplate(templateIndex)}
                        className="p-2 md:p-3 bg-red-500/20 hover:bg-red-500 rounded-xl text-red-400 hover:text-white transition-all duration-300 touch-target"
                        title="Delete template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Add Template Button (between templates) */}
                <div className="text-center">
                  <button
                    onClick={() => createNewTemplate(templateIndex)}
                    className="group p-3 bg-white/5 hover:bg-primary/20 rounded-full transition-all duration-300 border border-white/10 hover:border-primary/50 touch-target"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5 text-white/60 group-hover:text-primary group-hover:rotate-90 transition-all duration-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {templates.length === 0 && (
            <div className="text-center py-12 md:py-16 animate-fade-in">
              <div className="card-premium max-w-md mx-auto">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Templates Yet</h3>
                <p className="text-white/60 mb-6 text-sm md:text-base">Create your first background template to get started.</p>
                <button
                  onClick={() => createNewTemplate()}
                  className="px-6 py-3 bg-gradient-accent rounded-xl text-white font-semibold btn-premium touch-target"
                >
                  Create First Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-premium max-w-md w-full animate-scale-in">
            <div className="text-center space-y-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-400" />
              </div>
              
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-2">Delete Project</h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  Are you sure you want to delete this project? This will permanently delete all templates, texts, and images associated with code: <span className="font-mono text-primary">{code}</span>
                </p>
                <p className="text-red-400 text-sm mt-2 font-medium">
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 glass rounded-xl text-white font-semibold border border-white/20 hover:border-white/40 transition-all duration-300 touch-target"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex-1 px-4 py-3 bg-gradient-warning rounded-xl text-white font-semibold btn-premium touch-target"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TemplateCreatePopup
        isOpen={showCreatePopup}
        onClose={() => {
          setShowCreatePopup(false);
          setEditingTemplate(null);
        }}
        onSave={saveTemplate}
        existingTexts={editingTemplate !== null ? templates[editingTemplate]?.texts : []}
        existingSelectedIndex={editingTemplate !== null ? templates[editingTemplate]?.selectedIndex : -1}
      />

      <TextImagePopup
        isOpen={showImagePopup}
        onClose={() => {
          setShowImagePopup(false);
          setSelectedTemplateForImages(null);
          setSelectedTextIndex(null);
        }}
        onSave={saveTemplateImages}
        existingImages={
          selectedTemplateForImages !== null && selectedTextIndex !== null
            ? templates[selectedTemplateForImages]?.textImages[selectedTextIndex] || []
            : []
        }
        textIndex={selectedTextIndex || 0}
      />
    </div>
  );
};