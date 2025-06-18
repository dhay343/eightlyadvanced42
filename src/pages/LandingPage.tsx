import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCodePopup } from '../components/CreateCodePopup';
import { getProjectData } from '../services/firestore';
import { toast } from 'sonner';
import { Plus, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [enterCode, setEnterCode] = useState('');
  const [showEnterField, setShowEnterField] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handleCreateCode = (code: string) => {
    navigate(`/images/${code}`);
  };

  const handleEnterCode = async () => {
    if (!enterCode.trim()) return;
    
    setIsChecking(true);
    try {
      const data = await getProjectData(enterCode.trim());
      if (data.templates.length === 0) {
        toast.error('This code does not exist. Please create a new code instead.');
        setShowEnterField(false);
        setEnterCode('');
      } else {
        navigate(`/images/${enterCode.trim()}`);
      }
    } catch (error) {
      toast.error('This code does not exist. Please create a new code instead.');
      setShowEnterField(false);
      setEnterCode('');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl floating" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-80 md:h-80 bg-purple-500/10 rounded-full blur-3xl floating-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 safe-area-top safe-area-bottom">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12 animate-fade-in">
          {/* Hero Section */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full glass border border-white/10 text-xs md:text-sm text-white/80 mb-4 md:mb-6">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              Premium Image Vault Experience
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-gradient-primary">Secure</span>
              <br />
              <span className="text-white">Image Vault</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed px-4">
              Create, organize, and access your private image collections with military-grade security and elegant design.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4">
            <div className="card-premium group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Secure Access</h3>
              <p className="text-white/60 text-sm">Protected with unique codes and encrypted storage</p>
            </div>
            
            <div className="card-premium group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-white/60 text-sm">Instant access and seamless image management</p>
            </div>
            
            <div className="card-premium group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-accent rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Premium Design</h3>
              <p className="text-white/60 text-sm">Beautiful interface inspired by world-class design</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6 px-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowCreatePopup(true)}
                className="group relative w-full sm:w-auto px-6 py-4 md:px-8 md:py-4 bg-gradient-primary rounded-2xl text-white font-semibold text-base md:text-lg btn-premium min-w-[200px] flex items-center justify-center gap-3 touch-target"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Create New Vault
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                onClick={() => setShowEnterField(true)}
                className="group relative w-full sm:w-auto px-6 py-4 md:px-8 md:py-4 glass rounded-2xl text-white font-semibold text-base md:text-lg btn-premium min-w-[200px] flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 touch-target"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                Access Existing
              </button>
            </div>

            {/* Enter Code Field */}
            {showEnterField && (
              <div className="animate-scale-in space-y-4 max-w-md mx-auto">
                <div className="card-premium">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-white/80 text-left">
                      Enter your vault code
                    </label>
                    <input
                      type="text"
                      value={enterCode}
                      onChange={(e) => setEnterCode(e.target.value)}
                      placeholder="Enter existing code"
                      className="input-premium w-full text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEnterCode();
                        }
                      }}
                    />
                    <button
                      onClick={handleEnterCode}
                      disabled={isChecking || !enterCode.trim()}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 touch-target ${
                        isChecking || !enterCode.trim()
                          ? 'bg-white/10 text-white/50 cursor-not-allowed'
                          : 'bg-gradient-secondary text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {isChecking ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        'Access Vault'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-8 md:pt-12 text-center px-4">
            <p className="text-white/40 text-xs md:text-sm">
              Powered by advanced encryption • Built with premium design principles
            </p>
          </div>
        </div>
      </div>

      <CreateCodePopup
        isOpen={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onCreateCode={handleCreateCode}
      />
    </div>
  );
};