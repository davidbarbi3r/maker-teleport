import React from 'react';
import { toast } from 'react-toastify';

export class ErrorBoundary extends React.Component<{ componentName: string, children: React.ReactNode }> {
  componentName = 'component';

  constructor(props: { componentName: string, children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
    this.componentName = props.componentName || this.componentName;
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch() {
    // You can also log the error to an error reporting service
    toast.error(`Error loading ${this.componentName}`);
  }

  render() {
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ background: 'rgba(0,0,0,0.8)', padding: '30px', textAlign: 'center'}}>
          <div>
            There was a problem loading {this.componentName}.
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
