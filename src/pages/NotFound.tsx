import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl floating" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl floating-delayed" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="card-premium max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            
            <h1 className="text-6xl font-bold text-gradient-primary mb-4">404</h1>
            <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              The page you're looking for doesn't exist or has been moved to a different location.
            </p>
            
            <button
              onClick={() => navigate('/')}
              className="group px-8 py-4 bg-gradient-primary rounded-xl text-white font-semibold btn-premium flex items-center gap-3 mx-auto"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Return Home
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-white/40 text-sm">
              Error path: <span className="font-mono text-red-400">{location.pathname}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;