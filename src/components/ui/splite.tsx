"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Spline component with SSR disabled
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <SplineFallback />,
});

interface SplineSceneProps {
  scene: string;
  className?: string;
}

// Circular progress skeleton fallback for a premium perceived performance
export function SplineFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-950/40 border border-zinc-900/60 backdrop-blur-[4px]">
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/[0.03] via-transparent to-transparent" />
      <div className="relative flex flex-col items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 shadow-xl">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-500" />
        </div>
        <span className="text-[10px] font-bold tracking-widest text-amber-500/60 uppercase animate-pulse">
          Lancement du visuel 3D
        </span>
      </div>
    </div>
  );
}

// Static fallback visual in case spline fails to compile or parse
export function SplineStaticPlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-950/20 border border-zinc-900/30 backdrop-blur-[2px]">
      {/* Decorative luxury abstract glowing golden circles to simulate a 3D spline mesh */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/[0.02] via-transparent to-transparent" />
      <div className="absolute h-96 w-96 rounded-full border border-amber-500/[0.03] animate-pulse" />
      <div className="absolute h-[500px] w-[500px] rounded-full border border-yellow-500/[0.015] animate-spin" style={{ animationDuration: '40s' }} />
      <div className="absolute h-[650px] w-[650px] rounded-full border border-amber-500/[0.01] animate-spin" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />
      
      <div className="relative flex flex-col items-center gap-2 text-center p-6">
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span className="text-xs font-bold text-zinc-300">ClickMenu Interactive Preview</span>
        <span className="text-[10px] text-zinc-500 max-w-[240px]">
          Survolez les modules pour tester le fonctionnement de l’écosystème.
        </span>
      </div>
    </div>
  );
}

// React class error boundary to catch and suppress binary parsing errors gracefully
class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Spline 3D failed to load, falling back to static visual. Details:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function SplineScene({ scene, className }: SplineSceneProps) {
  // Let's also use an extremely stable luxury gold abstract spline scene url that loads perfectly across runtimes
  const stableSceneUrl = "https://prod.spline.design/6Wq1Q7YGyMwsI8bi/scene.splinecode";
  const targetScene = scene && scene.includes("kZiKo7tf7OhU18QZ") ? stableSceneUrl : scene;

  return (
    <div className={className}>
      <SplineErrorBoundary fallback={<SplineStaticPlaceholder />}>
        <Suspense fallback={<SplineFallback />}>
          <Spline scene={targetScene} />
        </Suspense>
      </SplineErrorBoundary>
    </div>
  );
}
