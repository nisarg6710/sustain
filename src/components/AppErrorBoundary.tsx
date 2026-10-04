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
        <div className="w-full max-w-lg">
          <p className="eyebrow">Well, this is awkward</p>
          <h1 className="display mt-4 text-display font-semibold">The page fell over</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Something in the app broke and it stopped dead rather than pretending half of it worked. Reloading
            usually sorts it. If it keeps happening, it&rsquo;s our fault and the details below say exactly what
            went wrong.
          </p>

          <pre className="mt-6 max-h-48 overflow-auto rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed text-muted-foreground">
            {error.message || String(error)}
          </pre>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Reload and hope
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-medium transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Try again without reloading
            </button>
          </div>
        </div>
      </main>
    );
  }
}
