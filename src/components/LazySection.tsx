import { useState, useEffect, useRef, ReactNode, Suspense } from 'react';

interface LazySectionProps {
    children: ReactNode;
    minHeight?: string;
}

export default function LazySection({ children, minHeight = "500px" }: LazySectionProps) {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "300px" } // Pre-load 300px before scrolling into view
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ minHeight: inView ? 'auto' : minHeight }}>
            {inView ? (
                <Suspense fallback={<div style={{ minHeight }} className="flex items-center justify-center animate-pulse bg-white/5" />}>
                    {children}
                </Suspense>
            ) : null}
        </div>
    );
}
