import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import App from './App.tsx'
import './index.css'
import { trackVisit } from './lib/trackVisit.js'

// Fire B2B IP enrichment — non-blocking, runs alongside PostHog
trackVisit();

posthog.init(
    import.meta.env.VITE_POSTHOG_KEY || '',
    {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        loaded: (posthog) => {
            if (import.meta.env.DEV) posthog.debug(false);
        }
    }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PostHogProvider client={posthog}>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </PostHogProvider>
    </React.StrictMode>,
)
