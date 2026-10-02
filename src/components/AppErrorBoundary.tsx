import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches anything thrown while rendering, including a chunk that fails to
 * load. `Suspense` only handles a *pending* promise — a rejected dynamic import
 * propagates straight through it — so without this boundary a single bad chunk
 * unmounts the whole app and the visitor gets a blank page with the reason
 * buried in a console they have no reason to open.
 *
 * This exists because of a real outage: a bundler change shipped a circular
 * chunk dependency, the app died with "Cannot access '_' before initialization",
 * and production rendered as an unexplained black screen. The failure was in
 * the console only.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the component stack: without it "where" is as unanswerable as "why".
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
        <div className="w-full max-w-lg space-y-5">
          <p className="eyebrow">Something went wrong</p>
          <h1 className="text-2xl font-semibold tracking-tight">This page failed to load</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The app hit an unexpected error and stopped rather than showing a half-working page. Reloading
            usually fixes it. If it keeps happening, the details below identify the cause.
          </p>

          <pre className="max-h-48 overflow-auto rounded-md border border-border bg-card p-3 text-xs leading-relaxed text-muted-foreground">
            {error.message || String(error)}
          </pre>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Reload the page
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Try again without reloading
            </button>
          </div>
        </div>
      </main>
    );
  }
}
