import React, { useState, useEffect } from 'react';
import { X, Plus, Type, Check, Trash2 } from 'lucide-react';

interface TemplateCreatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (texts: string[], selectedIndex: number) => void;
  existingTexts?: string[];
  existingSelectedIndex?: number;
}

export const TemplateCreatePopup: React.FC<TemplateCreatePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  existingTexts = [],
  existingSelectedIndex = -1
}) => {
  const [texts, setTexts] = useState<string[]>(existingTexts.length > 0 ? existingTexts : ['']);
  const [selectedIndex, setSelectedIndex] = useState(existingSelectedIndex >= 0 ? existingSelectedIndex : -1);

  useEffect(() => {
    if (isOpen) {
      if (existingTexts.length > 0) {
        setTexts(existingTexts);
        setSelectedIndex(existingSelectedIndex);
      } else {
        setTexts(['']);
        setSelectedIndex(-1);
      }
    }
  }, [isOpen, existingTexts, existingSelectedIndex]);

  if (!isOpen) return null;

  const addText = () => {
    setTexts([...texts, '']);
  };

  const updateText = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const deleteText = (index: number) => {
    const newTexts = texts.filter((_, i) => i !== index);
    setTexts(newTexts);
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleSave = () => {
    if (selectedIndex >= 0 && texts[selectedIndex]?.trim()) {
      onSave(texts.filter(t => t.trim()), selectedIndex);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-premium max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
              <Type className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Template</h2>
              <p className="text-white/60 text-sm">Add multiple text options and select the active one</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200 text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Add Text Button */}
        <div className="text-center mb-6">
          <button
            onClick={addText}
            className="group px-6 py-3 bg-gradient-primary rounded-xl text-white font-semibold btn-premium flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Add Text Option
          </button>
        </div>

        {/* Text List */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-6">
          {texts.map((text, index) => (
            <div key={index} className="card-premium !p-4 group">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs text-white font-medium">
                    {index + 1}
                  </span>
                  <button
                    onClick={() => setSelectedIndex(index)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      selectedIndex === index 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-white/60'
                    }`}
                    title="Set as active text"
                  >
                    {selectedIndex === index && <Check className="w-3 h-3" />}
                  </button>
                </div>
                
                <input
                  type="text"
                  value={text}
                  onChange={(e) => updateText(index, e.target.value)}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-1 input-premium !p-3 transition-all duration-300 ${
                    selectedIndex === index ? 'ring-2 ring-green-500/50 border-green-500/30' : ''
                  }`}
                  placeholder="Enter text option"
                />
                
                <div className="flex items-center gap-2">
                  {selectedIndex === index && text.trim() && (
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors duration-200 text-sm"
                    >
                      Save
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteText(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                    title="Delete text"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Type className="w-3 h-3 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-1">How to use</h4>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Add multiple text options for this template</li>
                <li>• Click the circle to select which text is currently active</li>
                <li>• Use navigation arrows to switch between texts later</li>
                <li>• Click "Save" when you have selected your active text</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {selectedIndex >= 0 && texts[selectedIndex]?.trim() && (
          <button
            onClick={handleSave}
            className="w-full py-3 px-6 bg-gradient-accent rounded-xl text-white font-semibold btn-premium"
          >
            Save Template
          </button>
        )}
      </div>
    </div>
  );
};