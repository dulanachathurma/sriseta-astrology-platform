import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-void text-ivory px-6">
          <div className="glass-card rounded-3xl p-10 max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="font-sinhala text-xl mb-2">යම් දෝෂයක් සිදු විය</h2>
            <p className="font-sinhala text-slate-soft mb-6">
              පිටුව නැවත පූරණය කර උත්සාහ කරන්න.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-gold to-copper text-void font-semibold"
            >
              නැවත පූරණය කරන්න
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
