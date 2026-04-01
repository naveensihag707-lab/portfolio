import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home, LogIn } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirebaseError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Database Error: ${parsed.error}`;
            isFirebaseError = true;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-md w-full glass p-12 rounded-[40px] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 blur-3xl rounded-full" />
            
            <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-destructive">
              <ShieldAlert size={40} />
            </div>

            <h1 className="text-3xl font-display font-bold mb-4">Something went wrong</h1>
            <p className="text-foreground/60 mb-8 leading-relaxed">
              {isFirebaseError ? "There was a problem connecting to the database. This might be due to configuration, permissions, or an unauthorized domain." : errorMessage}
            </p>

            {isFirebaseError && (
              <div className="mb-8 p-4 bg-accent/5 border border-accent/10 rounded-2xl text-xs font-mono text-left overflow-auto max-h-32">
                {this.state.error?.message}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-accent text-background font-bold rounded-2xl hover:glow-shadow transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Retry
              </button>
              
              {isFirebaseError && (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full py-4 bg-accent/20 text-accent font-bold rounded-2xl hover:bg-accent hover:text-background transition-all flex items-center justify-center gap-2"
                >
                  <LogIn size={18} /> Try Signing In
                </button>
              )}

              <button
                onClick={this.handleReset}
                className="w-full py-4 glass text-foreground/60 font-bold rounded-2xl hover:bg-foreground/5 transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} /> Go Home
              </button>
            </div>
            
            <p className="mt-8 text-[10px] uppercase tracking-widest opacity-30">
              Error Boundary Active
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
