"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex w-full h-screen items-center justify-center flex-col p-4 bg-bg-primary">
          <h2 className="text-xl font-bold text-danger mb-2">Something went wrong</h2>
          <p className="text-text-secondary mb-6 text-sm">We ran into an unexpected bug.</p>
          <button
            className="px-6 py-3 bg-accent text-text-on-accent rounded-xl font-bold active:bg-accent-active card-depth"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
