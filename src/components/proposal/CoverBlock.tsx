import React from 'react';
import { jwTheme } from '../../theme/jwTheme';

interface CoverBlockProps {
  title: string;
  companyLogo?: string;
  onTitleChange?: (val: string) => void;
  isLocked?: boolean;
}

/**
 * Premium proposal cover block.
 * Design language matches jwaiconsulting.com — glassmorphism, glow blurs,
 * grid-dot background, Inter typography, deep navy + electric blue/sky gradient.
 */
const CoverBlock: React.FC<CoverBlockProps> = ({
  title, companyLogo, onTitleChange, isLocked
}) => {
  const cleanTitle = title.replace(/<[^>]*>/g, '').trim() || 'PROPOSAL';

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '640px',
        background: `linear-gradient(160deg, #f0f4f8 0%, #e8f0fe 50%, #f0f4f8 100%)`,
        fontFamily: jwTheme.typography.fontHeading,
      }}
    >
      {/* ── Grid dot overlay (matches website bg) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/grid.svg')`,
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.07), rgba(0,0,0,0))',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.07), rgba(0,0,0,0))',
          opacity: 0.5,
        }}
      />

      {/* ── Glow blurs (matches Hero section blobs) ── */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '-60px', right: '-60px',
          width: '360px', height: '360px',
          background: 'radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: '-60px', left: '-60px',
          width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(125,211,252,0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ── Top gradient fade (matches website hero) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(240,244,248,0.5), rgba(240,244,248,0.9))',
        }}
      />

      {/* ── MAIN CONTENT ── */}
      <div
        className="relative z-10 flex flex-col justify-between"
        style={{ minHeight: '640px', padding: '52px 64px' }}
      >
        {/* Top row: Logo or brand mark */}
        <div className="flex items-center justify-between">
          {companyLogo ? (
            <img src={companyLogo} alt="Logo" className="h-9 w-auto object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                style={{ background: `linear-gradient(135deg, ${jwTheme.colors.secondary}, ${jwTheme.colors.secondaryDark})` }}
              >
                JW
              </div>
              <span className="text-sm font-bold tracking-tight" style={{ color: jwTheme.colors.primary }}>
                AI Consulting
              </span>
            </div>
          )}

          {/* Eyebrow badge — mirrors "Architecting the Intelligence Layer" style */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(219,234,254,0.7)',
              border: `1px solid ${jwTheme.colors.border}`,
              color: jwTheme.colors.secondary,
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 0l1.12 3.45H9.51L6.69 5.6l1.07 3.4L5 7 2.24 9l1.07-3.4L.49 3.45H3.88z"/>
            </svg>
            Consulting Proposal
          </div>
        </div>

        {/* Center: Hero title area */}
        <div className="flex-1 flex flex-col justify-center mt-8 mb-6">

          {/* Category label — like "BUSINESS PROJECT" in the reference */}
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
            style={{ color: jwTheme.colors.secondary }}
          >
            JW AI Consulting
          </p>

          {/* Editable main title */}
          <div
            contentEditable={!isLocked}
            suppressContentEditableWarning
            onBlur={(e) => onTitleChange?.(e.currentTarget.innerText)}
            style={{
              fontSize: '3.75rem',
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              background: `linear-gradient(135deg, ${jwTheme.colors.primary} 0%, #1e3a5f 50%, ${jwTheme.colors.secondaryDark} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              cursor: isLocked ? 'default' : 'text',
              outline: 'none',
              minHeight: '4.5rem',
            }}
            className="focus:outline-none"
          >
            {cleanTitle}
          </div>

          {/* Blue gradient divider line (like CTA glow bars on site) */}
          <div
            className="mt-6 mb-5 h-1 w-20 rounded-full"
            style={{ background: `linear-gradient(90deg, ${jwTheme.colors.secondary}, ${jwTheme.colors.accent})` }}
          />

          {/* Subtext */}
          <p
            className="max-w-md leading-relaxed text-base"
            style={{ color: jwTheme.colors.textMuted }}
          >
            A comprehensive AI consulting engagement proposal prepared exclusively for your organization.
          </p>

          {/* CTA-style info pill — mirrors the rounded-full button aesthetic */}
          <div className="mt-8 flex items-center gap-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${jwTheme.colors.secondary}, ${jwTheme.colors.secondaryDark})`,
                boxShadow: `0 8px 24px rgba(37,99,235,0.3)`,
              }}
            >
              Confidential
            </div>
            <span className="text-sm" style={{ color: jwTheme.colors.textMuted }}>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Footer — clean glass card border, mirrors navbar glass */}
        <div
          className="pt-5 flex items-center justify-between"
          style={{
            borderTop: `1px solid ${jwTheme.colors.border}`,
          }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: jwTheme.colors.textMuted }}>Prepared by</p>
            <p className="text-sm font-bold" style={{ color: jwTheme.colors.primary }}>JW AI Consulting</p>
            <p className="text-xs" style={{ color: jwTheme.colors.textMuted }}>jwaiconsulting.com</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: jwTheme.colors.textMuted }}>Proposal Status</p>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(219,234,254,0.8)', color: jwTheme.colors.secondaryDark }}
            >
              Draft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverBlock;
