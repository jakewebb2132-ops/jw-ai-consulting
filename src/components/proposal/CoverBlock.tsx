import React from 'react';
import { jwTheme } from '../../theme/jwTheme';

interface CoverBlockProps {
  title: string;
  subtitle?: string;
  companyLogo?: string;
  onTitleChange?: (val: string) => void;
  onSubtitleChange?: (val: string) => void;
  isLocked?: boolean;
}

/**
 * Premium Geometric Cover Block
 * Inspired by professional proposal design — dark navy + electric blue geometric corners,
 * with a bold centered title area.
 */
const CoverBlock: React.FC<CoverBlockProps> = ({
  title, subtitle, companyLogo, onTitleChange, onSubtitleChange, isLocked
}) => {
  return (
    <div
      className="relative w-full overflow-hidden bg-white"
      style={{ minHeight: '620px', fontFamily: jwTheme.typography.fontHeading }}
    >
      {/* ── TOP-RIGHT geometric shapes ── */}
      <div className="absolute top-0 right-0 pointer-events-none select-none z-10">
        {/* Large dark navy diamond */}
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          <rect x="60" y="-30" width="120" height="120" rx="12"
            fill={jwTheme.colors.primary} opacity="0.9"
            transform="rotate(20 60 -30)"
          />
          {/* Medium blue parallelogram layered */}
          <rect x="30" y="10" width="90" height="80" rx="10"
            fill={jwTheme.colors.secondary} opacity="0.7"
            transform="rotate(20 30 10)"
          />
        </svg>
      </div>

      {/* ── TOP-LEFT hex lattice pattern ── */}
      <div className="absolute top-0 left-0 pointer-events-none select-none z-0 opacity-30">
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
          {[...Array(4)].map((_, row) =>
            [...Array(4)].map((__, col) => {
              const cx = col * 32 + (row % 2 === 0 ? 0 : 16);
              const cy = row * 28;
              const r = 12;
              // Hexagon points
              const pts = [...Array(6)].map((_, i) => {
                const angleDeg = 60 * i - 30;
                const rad = (Math.PI / 180) * angleDeg;
                return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
              }).join(' ');
              return (
                <polygon
                  key={`${row}-${col}`}
                  points={pts}
                  stroke={jwTheme.colors.secondary}
                  strokeWidth="1.2"
                  fill="none"
                />
              );
            })
          )}
        </svg>
      </div>

      {/* ── BOTTOM-LEFT azure sweep ── */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none z-0">
        <svg width="240" height="200" viewBox="0 0 240 200" fill="none">
          <path
            d="M0 200 L0 60 Q40 30 100 80 Q160 120 200 60 L240 40 L240 200 Z"
            fill={jwTheme.colors.secondary}
            opacity="0.18"
          />
          <path
            d="M0 200 L0 100 Q50 70 110 110 Q160 140 200 100 L240 80 L240 200 Z"
            fill={jwTheme.colors.secondary}
            opacity="0.12"
          />
          <path
            d="M0 200 L0 140 Q60 120 120 150 Q170 170 240 130 L240 200 Z"
            fill={jwTheme.colors.accent}
            opacity="0.35"
          />
        </svg>
      </div>

      {/* ── BOTTOM-RIGHT hex lattice ── */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none z-0 opacity-25">
        <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
          {[...Array(4)].map((_, row) =>
            [...Array(4)].map((__, col) => {
              const cx = 130 - col * 32 - (row % 2 === 0 ? 0 : 16);
              const cy = 130 - row * 28;
              const r = 12;
              const pts = [...Array(6)].map((_, i) => {
                const angleDeg = 60 * i - 30;
                const rad = (Math.PI / 180) * angleDeg;
                return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
              }).join(' ');
              return (
                <polygon
                  key={`${row}-${col}`}
                  points={pts}
                  stroke={jwTheme.colors.secondary}
                  strokeWidth="1.2"
                  fill="none"
                />
              );
            })
          )}
        </svg>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-20 flex flex-col justify-between h-full" style={{ minHeight: '620px', padding: '56px 64px' }}>

        {/* Logo if present */}
        {companyLogo && (
          <div className="mb-6">
            <img src={companyLogo} alt="Logo" className="h-10 w-auto object-contain" />
          </div>
        )}

        {/* Main title area — centered vertically in the page */}
        <div className="flex-1 flex flex-col justify-center mt-8">
          {/* Eyebrow label */}
          <p
            className="text-sm font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: jwTheme.colors.coverLabel }}
          >
            Consulting Proposal
          </p>

          {/* Editable main title */}
          <div
            contentEditable={!isLocked}
            suppressContentEditableWarning
            onBlur={(e) => onTitleChange?.(e.currentTarget.innerText)}
            className="outline-none focus:outline-none"
            style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: jwTheme.colors.primary,
              minHeight: '4.5rem',
              cursor: isLocked ? 'default' : 'text',
            }}
          >
            {title || 'PROPOSAL'}
          </div>

          {/* Divider */}
          <div className="mt-6 mb-6 h-[3px] w-16 rounded-full" style={{ backgroundColor: jwTheme.colors.secondary }} />

          {/* Editable subtitle */}
          <div
            contentEditable={!isLocked}
            suppressContentEditableWarning
            onBlur={(e) => onSubtitleChange?.(e.currentTarget.innerText)}
            className="outline-none focus:outline-none max-w-sm"
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: jwTheme.colors.textBody,
              cursor: isLocked ? 'default' : 'text',
              minHeight: '2rem',
            }}
          >
            {subtitle || 'A comprehensive consulting engagement proposal prepared exclusively for your organization.'}
          </div>
        </div>

        {/* Footer row */}
        <div
          className="mt-12 pt-6 flex items-end justify-between border-t"
          style={{ borderColor: `${jwTheme.colors.accent}80` }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: jwTheme.colors.textMuted }}>Prepared by</p>
            <p className="text-sm font-semibold" style={{ color: jwTheme.colors.primary }}>JW AI Consulting</p>
            <p className="text-xs" style={{ color: jwTheme.colors.textMuted }}>jwaiconsulting.com</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: jwTheme.colors.textMuted }}>Date</p>
            <p className="text-sm" style={{ color: jwTheme.colors.textBody }}>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverBlock;
