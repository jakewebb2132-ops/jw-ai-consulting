import { Suspense, lazy, useState, Component, ErrorInfo, ReactNode } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
    scene: string;
    className?: string;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Spline Component Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

const SplineScene = ({ scene, className }: SplineSceneProps) => {
    const [loadError, setLoadError] = useState(false);

    if (loadError) {
        return null; // Hero will show its own background if we return null here
    }

    return (
        <div className={`relative w-full h-full ${className}`}>
            <SplineErrorBoundary fallback={<div className="spline-fallback-active" />}>
                <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                }>
                    <Spline
                        scene={scene}
                        className="w-full h-full opacity-0 animate-fade-in"
                        onError={() => {
                            console.error("Spline Scene failed to load");
                            setLoadError(true);
                        }}
                        onLoad={(splineApp) => {
                            const canvas = splineApp.canvas;
                            if (canvas) {
                                canvas.style.transition = 'opacity 1s ease-in-out';
                                canvas.style.opacity = '1';
                            }

                            // Programmatically hide the original text layers from the Spline scene
                            try {
                                const objects = splineApp.getAllObjects();

                                const hideText = (obj: any) => {
                                    if (!obj) return;

                                    const name = obj.name ? obj.name.toLowerCase() : "";

                                    // Hide objects based on Spline layer names or contents
                                    if (
                                        name === "text" ||
                                        name === "text 2" ||
                                        name.includes("clarity") ||
                                        name.includes("we turn")
                                    ) {
                                        obj.visible = false;
                                    }

                                    // Also check text values if accessible
                                    if (obj.text && typeof obj.text === 'string') {
                                        if (obj.text.includes("Clarity") || obj.text.includes("turn complex")) {
                                            obj.visible = false;
                                        }
                                    }

                                    if (obj.children && Array.isArray(obj.children)) {
                                        obj.children.forEach(hideText);
                                    }
                                };

                                if (Array.isArray(objects)) {
                                    objects.forEach(hideText);
                                }
                            } catch (e) {
                                console.error("Error hiding spline text:", e);
                            }
                        }}
                    />
                </Suspense>
            </SplineErrorBoundary>
        </div>
    );
};

export default SplineScene;
