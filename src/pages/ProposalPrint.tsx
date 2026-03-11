import React, { useEffect } from 'react';
import { useProposalStore } from '../store/proposalStore';

const ProposalPrint: React.FC = () => {
  const { proposal } = useProposalStore();

  useEffect(() => {
    // A helpful signal flag for the puppeteer engine if we needed programmatic verification
    window.document.documentElement.classList.add('is-print-mode');
    return () => {
      window.document.documentElement.classList.remove('is-print-mode');
    };
  }, []);

  if (!proposal) {
    return <div className="p-8">Loading proposal...</div>;
  }

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen relative">
      
      {/* Global Watermark (Print Mode) */}
      {proposal.companyLogo && (
        <div className="fixed top-8 right-8 opacity-15 pointer-events-none z-0 mix-blend-multiply grayscale">
          <img 
            src={proposal.companyLogo} 
            alt="Company Watermark" 
            className="max-h-12 w-auto object-contain"
          />
        </div>
      )}

      <div className="w-full max-w-[21cm] mx-auto p-[2cm] relative z-10">
        
        <div className="print-title-section mb-12 border-b-2 border-slate-900 pb-6 print-break-avoid">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            {proposal.title || 'Proposal Document'}
          </h1>
          <p className="text-lg text-slate-500 font-medium">JW AI Consulting</p>
        </div>

        <div className="flex flex-col gap-6">
          {proposal.blocks.map((block) => (
            <div 
              key={block.id} 
              className="print-block-wrapper print-break-avoid w-full"
            >
              {block.type === 'HEADING' && (
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight pt-4 pb-2">{block.content}</h2>
              )}
              {block.type === 'TEXT' && (
                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
              )}
              {block.type === 'CANVA_EMBED' && (
                <div className="w-full relative rounded-md overflow-hidden bg-slate-50 border border-slate-200" style={{ paddingTop: '56.25%' }}>
                   {block.content ? (
                      <iframe
                        title={`Canva Embed ${block.id}`}
                        src={block.content}
                        className="absolute top-0 left-0 w-full h-full border-none"
                        allow="fullscreen"
                        allowFullScreen
                      />
                    ) : null}
                </div>
              )}
              {block.type === 'IMAGE_UPLOAD' && (
                <div className="w-full h-64 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 font-medium tracking-wide">Image Asset</div>
              )}
              {block.type === 'PRICING_TABLE' && (
                <div className="w-full p-6 bg-slate-50 rounded-md border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Investment Summary</h3>
                  <div className="text-sm text-slate-600 italic">No pricing line items configured yet.</div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProposalPrint;
