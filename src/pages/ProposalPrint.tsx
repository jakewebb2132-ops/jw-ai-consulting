import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProposalStore } from '../store/proposalStore';
import { jwTheme } from '../theme/jwTheme';
import CoverBlock from '../components/proposal/CoverBlock';

const ProposalPrint: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchProposal, proposal } = useProposalStore();

  useEffect(() => {
    // A helpful signal flag for the puppeteer engine if we needed programmatic verification
    window.document.documentElement.classList.add('is-print-mode');
    
    if (id) {
      fetchProposal(id);
    }

    return () => {
      window.document.documentElement.classList.remove('is-print-mode');
    };
  }, [id, fetchProposal]);

  useEffect(() => {
    if (proposal) {
      // Give it a moment for fonts/images to settle
      const timer = setTimeout(() => {
        window.print();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [proposal]);

  if (!proposal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-500 font-sans p-8 text-center">
        <div className="animate-spin mb-6">
           <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Preparing Your Document</h2>
        <p className="text-zinc-500 max-w-xs">Connecting to the secure proposal engine and generating your high-fidelity PDF...</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full text-slate-900 min-h-screen relative font-sans"
      style={{ 
        background: `linear-gradient(160deg, #f0f4f8 0%, #e8f0fe 50%, #f0f4f8 100%)`,
      }}
    >
      
      {/* Document-wide Grid Background (Print) */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{ 
          backgroundImage: `url('/grid.svg')`,
          backgroundPosition: 'center',
        }}
      />
      
      {/* Global Watermark (Print Mode) */}
      {proposal.companyLogo && (
        <div className="fixed top-8 right-8 opacity-20 pointer-events-none z-0 mix-blend-multiply grayscale">
          <img 
            src={proposal.companyLogo} 
            alt="Company Watermark" 
            className="max-h-36 w-auto object-contain"
          />
        </div>
      )}

      <div className="w-full max-w-[21cm] mx-auto p-[2cm] relative z-10">
        
        <div className="flex flex-col gap-8">
          {proposal.blocks.map((block) => (
            <div 
              key={block.id} 
              className="print-block-wrapper print-break-avoid w-full"
            >
            {block.type === 'HEADING' && block.orderIndex === 0 ? (
              <div className="-mx-[2cm] -mt-[2cm] mb-12">
                <CoverBlock
                  title={block.content.replace(/<[^>]*>/g, '').trim() || 'PROPOSAL'}
                  companyLogo={proposal.companyLogo}
                  isLocked={true}
                />
              </div>
            ) : block.type === 'HEADING' ? (
              <div 
                className="prose max-w-none text-3xl font-bold tracking-tight pt-4 pb-2 border-l-4 pl-4" 
                style={{ 
                  color: jwTheme.colors.textHeading,
                  borderColor: jwTheme.colors.secondary,
                  fontFamily: jwTheme.typography.fontHeading
                }}
                dangerouslySetInnerHTML={{ __html: block.content }} 
              />
            ) : null}
              {block.type === 'TEXT' && (
                <div 
                  className="prose max-w-none proposal-render text-lg text-slate-700 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: block.content }} 
                />
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
              {block.type === 'IMAGE_UPLOAD' && block.content && (
                <div className="w-full mb-6 print-break-avoid flex justify-center">
                   <img src={block.content} className="w-full max-h-[800px] object-contain rounded-md border border-slate-200 shadow-sm" alt="Proposal Graphic" />
                </div>
              )}
              {block.type === 'PRICING_TABLE' && (
                <div className="w-full rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm mt-8">
                  <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: jwTheme.typography.fontHeading }}>
                      Investment Summary
                    </h3>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                    {proposal.pricing?.map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-4 rounded-lg bg-zinc-50/50 border border-zinc-100">
                         <div className="flex-1 pr-8">
                           <div className="flex items-center gap-3 mb-1">
                             {item.isOptional && (
                               <div className="w-4 h-4 rounded border border-zinc-300 bg-white" />
                             )}
                             <h4 className="font-semibold text-slate-900">{item.deliverable}</h4>
                             {item.isOptional && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Optional Add-on</span>}
                           </div>
                           <p className="text-sm text-slate-500 leading-relaxed ml-7">{item.description}</p>
                         </div>
                         <div className="text-right font-semibold text-slate-900">
                           {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.unitPrice)}
                         </div>
                      </div>
                    ))}

                    {/* Total Readout */}
                    <div className="mt-4 pt-4 border-t border-zinc-200 flex justify-between items-center px-4">
                      <span className="text-slate-500 font-medium">Estimated Total</span>
                      <span className="text-2xl font-bold" style={{ color: jwTheme.colors.secondary }}>
                         {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(proposal.totalValue || 0)}
                      </span>
                    </div>
                  </div>
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
