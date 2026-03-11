import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProposalStore } from '../store/proposalStore';
import { jwTheme } from '../theme/jwTheme';
import { CheckCircle, X, CircleNotch } from 'phosphor-react';

const ProposalPublic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // In a real app, you would fetch the proposal by ID from the database here.
  // For this local demo, we read from the Zustand store.
  const { proposal } = useProposalStore();

  // Check our mock telemetry cache to see if the document was signed across tabs
  const [isAccepted, setIsAccepted] = useState(false);
  const [signatureData, setSignatureData] = useState<{ name: string, date: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sigName, setSigName] = useState('');
  const [sigTitle, setSigTitle] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Telemetry Engine: Track View & Check Status ---
  useEffect(() => {
    if (!id) return;

    const trackView = async () => {
      try {
        const response = await fetch('/api/track-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ proposalId: id, event: 'VIEW' }),
        });
        const data = await response.json();
        if (data.telemetry?.status === 'ACCEPTED') {
          setIsAccepted(true);
          setSignatureData({
            name: data.telemetry.signatureName || 'Authorized Signatory',
            date: data.telemetry.acceptedAt || new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Failed to send telemetry:', err);
      }
    };

    trackView();
  }, [id]);

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-500">
        Loading document...
      </div>
    );
  }

  // --- Telemetry Engine: Track Pricing Interaction ---
  const handlePricingInteraction = async () => {
    if (isAccepted) return; // Locked
    try {
      await fetch('/api/track-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: id, event: 'PRICING_INTERACTED' }),
      });
    } catch (err) {
      console.error('Failed to send pricing telemetry:', err);
    }
  };

  const handleSignProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed || !sigName || !sigTitle) return;

    setIsSubmitting(true);
    const timestamp = new Date().toISOString();

    try {
      const response = await fetch('/api/accept-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: id,
          signatureName: sigName,
          signatureTitle: sigTitle,
          timestamp,
        }),
      });

      if (response.ok) {
        setIsAccepted(true);
        setSignatureData({ name: sigName, date: timestamp });
        setIsModalOpen(false);
      } else {
        alert("There was an error processing your signature. Please try again.");
      }
    } catch (error) {
       console.error("Signature error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center py-12 px-4 selection:bg-blue-100 pb-32">
      
      {/* The Paper Document */}
      <div className="w-full max-w-[816px] min-h-[1056px] bg-white shadow-2xl rounded-sm overflow-hidden relative p-8 md:p-16">
        
        {/* Document Freeze Badge */}
        {isAccepted && (
          <div className="mb-12 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-800">
             <CheckCircle weight="fill" className="text-xl mt-0.5 shrink-0" />
             <div>
               <p className="font-bold text-sm uppercase tracking-wider mb-1">Document Locked & Executed</p>
               <p className="text-sm">Accepted electronically on {new Date(signatureData?.date || "").toLocaleDateString()} by {signatureData?.name}.</p>
             </div>
          </div>
        )}

        {proposal.blocks.map((block) => (
          <div key={block.id} className="mb-8">
            {block.type === 'HEADING' && (
              <h2 
                className="text-4xl font-extrabold tracking-tight mb-4"
                style={{ 
                  color: block.designSettings?.theme === 'dark' ? jwTheme.colors.primary : jwTheme.colors.textHeading,
                  fontFamily: jwTheme.typography.fontHeading
                }}
              >
                {block.content}
              </h2>
            )}

            {block.type === 'TEXT' && (
              <div 
                className="text-lg leading-relaxed whitespace-pre-wrap rounded-xl p-6 shadow-sm border border-black/5"
                style={{ 
                  color: jwTheme.colors.textBody,
                  backgroundColor: block.designSettings?.theme === 'secondary-tint' ? `${jwTheme.colors.secondary}08` : 'transparent',
                  fontFamily: jwTheme.typography.fontBody
                }}
              >
                {/* Parse basic markdown bolding for the text */}
                <span dangerouslySetInnerHTML={{ 
                  __html: block.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }} />
              </div>
            )}

            {block.type === 'CANVA_EMBED' && (
              <div className="w-full relative rounded-xl overflow-hidden shadow-lg border border-black/10" style={{ paddingTop: '56.25%' }}>
                {block.content ? (
                  <iframe
                    title={`Canva Embed ${block.id}`}
                    src={block.content}
                    className="absolute top-0 left-0 w-full h-full border-none"
                    allow="fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 text-zinc-400 text-sm">
                    Interactive Visual Missing
                  </div>
                )}
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
                     <div key={item.id} className="flex items-start justify-between p-4 rounded-lg bg-zinc-50/50 border border-zinc-100 hover:border-blue-100 transition-colors">
                        <div className="flex-1 pr-8">
                          <div className="flex items-center gap-3 mb-1">
                            {item.isOptional && (
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                defaultChecked={false}
                                onChange={handlePricingInteraction}
                                disabled={isAccepted}
                                aria-label={`Toggle ${item.deliverable}`}
                              />
                            )}
                            <h4 className="font-semibold text-slate-900">{item.deliverable}</h4>
                            {item.isOptional && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Optional Add-on</span>}
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed ml-7">{item.description}</p>
                       </div>
                       <div className="text-right font-medium text-slate-900">
                         {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.unitPrice)}
                       </div>
                     </div>
                   ))}

                   {/* Fixed Total Readout (For Demo Purposes) */}
                   <div className="mt-4 pt-4 border-t border-zinc-200 flex justify-between items-center px-4">
                     <span className="text-slate-500 font-medium">Estimated Total</span>
                     <span className="text-2xl font-bold text-slate-900" style={{ color: jwTheme.colors.primary }}>
                       {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(proposal.totalValue)}
                     </span>
                   </div>
                 </div>
               </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Action Bar (Sticky Bottom) */}
      {!isAccepted && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-4 md:p-6 z-40 flex justify-center">
          <div className="w-full max-w-[816px] flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="text-center md:text-left">
               <p className="text-sm text-zinc-500 font-medium">Project Investment</p>
               <p className="text-2xl font-bold text-slate-900">
                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(proposal.totalValue)}
               </p>
             </div>
             <button 
               onClick={() => setIsModalOpen(true)}
               style={{ backgroundColor: jwTheme.colors.primary }}
               className="w-full md:w-auto px-8 py-3 text-white font-medium rounded-md shadow-md hover:brightness-110 transition-all text-lg"
             >
               Accept & Sign
             </button>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {isModalOpen && !isAccepted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h3 className="text-xl font-bold text-slate-900">Digital Signature</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSignProposal} className="p-6 flex flex-col gap-6">
              
              <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                <CheckCircle weight="fill" className="text-xl shrink-0 mt-0.5" />
                <p>By signing, you are legally accepting the scope and total investment of <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(proposal.totalValue)}</strong> as presented in this document.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-zinc-600 font-medium mb-1">Full Legal Name</label>
                  <input 
                    type="text" required
                    value={sigName} onChange={e => setSigName(e.target.value)}
                    className="w-full border border-zinc-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-600 font-medium mb-1">Title / Role</label>
                  <input 
                    type="text" required
                    value={sigTitle} onChange={e => setSigTitle(e.target.value)}
                    className="w-full border border-zinc-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Chief Marketing Officer" 
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group mt-2">
                <input 
                  type="checkbox" required
                  checked={isAgreed} onChange={e => setIsAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer transition-all"
                />
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">
                  I agree to the terms and authorize this project scope. I understand this constitutes a binding digital signature.
                </span>
              </label>

              <button 
                type="submit"
                disabled={!isAgreed || !sigName || !sigTitle || isSubmitting}
                style={{ backgroundColor: jwTheme.colors.primary }}
                className="w-full mt-2 py-3.5 text-white font-bold rounded-md shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><CircleNotch weight="bold" className="animate-spin" /> Authorizing...</> : 'Acknowledge & Sign'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProposalPublic;
