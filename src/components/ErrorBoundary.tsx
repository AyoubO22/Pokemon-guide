import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400 space-y-2">
          <p className="font-semibold">Une erreur est survenue{this.props.label ? ` dans ${this.props.label}` : ''}.</p>
          <p className="text-xs text-red-500 font-mono">{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="text-xs text-red-400 underline hover:text-red-300"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
