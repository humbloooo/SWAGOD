"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
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
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative mb-8">
                        <AlertTriangle size={80} className="text-primary animate-pulse" />
                        <div className="absolute inset-0 blur-2xl bg-primary/20 -z-10"></div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 glitch-hover inline-block">
                        CRITICAL_ERROR
                    </h1>

                    <p className="font-mono text-white/50 mb-12 max-w-md uppercase tracking-widest text-xs leading-loose">
                        The system encountered an unhandled transmission error. Hardware integrity check requested.
                    </p>

                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center justify-center gap-3 px-8 py-5 bg-primary text-black font-black uppercase tracking-widest hover:bg-white transition-all group"
                        >
                            <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                            REBOOT SYSTEM
                        </button>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-3 px-8 py-5 border border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                        >
                            <Home size={20} />
                            EXIT TO HUB
                        </Link>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/5 w-full max-w-2xl">
                        <p className="font-mono text-[10px] text-white/20 uppercase text-left break-all">
                            {this.state.error?.message}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
