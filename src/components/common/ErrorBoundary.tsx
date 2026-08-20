import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageSquare } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[HARCONXS System Error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 selection:bg-amber-400 selection:text-zinc-950">
          <div className="max-w-xl w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
                HTTP 500 • Internal System Exception
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                Atelier Continuity Interruption
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
                An unexpected condition occurred while rendering this view. Our engineering team has been notified via telemetry.
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="text-left bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-red-400 overflow-x-auto max-h-40">
                <p className="font-bold text-zinc-300 mb-1">{this.state.error.toString()}</p>
                <pre className="text-zinc-500 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/10"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Storefront</span>
              </button>
            </div>

            <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500 flex items-center justify-center gap-2 font-mono">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Need concierge assistance? Contact concierge@harconxs.com</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
