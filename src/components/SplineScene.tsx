import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
    scene: string;
    className?: string;
}

const SplineScene = ({ scene, className }: SplineSceneProps) => {
    return (
        <div className={`relative w-full h-full ${className}`}>
            <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            }>
                <Spline
                    scene={scene}
                    className="w-full h-full opacity-0 animate-fade-in"
                    onLoad={(splineApp) => {
                        // Ensure it's visible once loaded
                        const canvas = splineApp.canvas;
                        if (canvas) {
                            canvas.style.transition = 'opacity 1s ease-in-out';
                            canvas.style.opacity = '1';
                        }
                    }}
                />
            </Suspense>
        </div>
    );
};

export default SplineScene;
