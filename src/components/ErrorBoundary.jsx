import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info);
  }

  handleClearAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#070818] text-white px-6 py-12">
          <div className="rounded-3xl p-8 md:p-10 max-w-lg text-center bg-white/5 border border-white/15 backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="font-sinhala text-2xl font-bold mb-2 text-white">
              යම් දෝෂයක් සිදු විය
            </h2>
            <p className="font-sinhala text-white/70 text-sm mb-6 leading-relaxed">
              පිටුව නැවත පූරණය කර උත්සාහ කරන්න. ගැටලුව දිගටම පවතී නම් දත්ත Reset කර නැවත පිවිසෙන්න.
            </p>

            {this.state.error?.message && (
              <div className="mb-6 p-3 rounded-xl bg-black/40 border border-white/10 text-left overflow-x-auto">
                <p className="text-[11px] font-mono text-amber-300/80 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#06B6D4] text-[#0A0B1E] font-bold font-sinhala text-sm shadow-lg hover:opacity-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                නැවත පූරණය කරන්න
              </button>

              <button
                onClick={this.handleClearAndReload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-sinhala text-sm transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                Reset & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
