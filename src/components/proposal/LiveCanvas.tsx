import React from 'react';
import { useProposalStore } from '../../store/proposalStore';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContentBlock } from '../../types/proposal';
import { jwTheme } from '../../theme/jwTheme';
import RichTextEditor from './RichTextEditor';
import CoverBlock from './CoverBlock';
import { Trash, Plus } from 'phosphor-react';

const CanvasBlock: React.FC<{ block: ContentBlock; isActive: boolean; isLocked: boolean; onSelect: () => void }> = ({ block, isActive, isLocked, onSelect }) => {
  const { updateBlock, updatePricingItem, removePricingItem, addPricingItem, proposal } = useProposalStore();
  
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Dim the original block while dragging
    fontFamily: block.type === 'HEADING' ? jwTheme.typography.fontHeading : jwTheme.typography.fontBody,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative outline-none transition-colors border p-8 m-4 rounded-lg ${isLocked ? 'cursor-default' : 'cursor-text'} ${
        isDragging ? 'border-indigo-400 bg-indigo-50/10' : isActive ? 'border-blue-400 bg-blue-50/50 shadow-sm' : `border-transparent ${!isLocked && 'hover:border-blue-200 hover:bg-blue-50/30'}`
      }`}
    >
      {block.type === 'HEADING' && block.orderIndex === 0 ? (
        // First heading block → render as the premium cover page
        <div className="w-full rounded-none overflow-hidden shadow-sm">
          <CoverBlock
            title={block.content.replace(/<[^>]*>/g, '').trim() || 'PROPOSAL'}
            companyLogo={proposal?.companyLogo}
            onTitleChange={(val) => updateBlock(block.id, { content: val })}
            isLocked={isLocked}
          />
        </div>
      ) : block.type === 'HEADING' ? (
        // Subsequent heading blocks — styled with navy accent border
        <div className="w-full pb-1 border-l-4 pl-4" style={{ borderColor: jwTheme.colors.secondary }}>
          <RichTextEditor 
            content={block.content}
            onChange={(html) => updateBlock(block.id, { content: html })}
            isHeading={true}
            disabled={isLocked}
            theme={block.designSettings?.theme}
            placeholder="Enter heading..."
          />
        </div>
      ) : null}
      {block.type === 'TEXT' && (
        <div 
          className="w-full rounded-md transition-colors"
          style={{ 
            backgroundColor: block.designSettings?.theme === 'secondary-tint' 
              ? `${jwTheme.colors.accent}60` 
              : 'transparent',
            borderLeft: block.designSettings?.theme === 'secondary-tint' 
              ? `3px solid ${jwTheme.colors.secondary}60` 
              : 'none',
            paddingLeft: block.designSettings?.theme === 'secondary-tint' ? '1.25rem' : '0',
          }}
        >
          <RichTextEditor 
            content={block.content}
            onChange={(html) => updateBlock(block.id, { content: html })}
            isHeading={false}
            disabled={isLocked}
            theme={block.designSettings?.theme}
            placeholder="Start typing your content..."
          />
        </div>
      )}
      {block.type === 'CANVA_EMBED' && (
        <div 
          className="w-full relative rounded border border-zinc-300 bg-zinc-50 overflow-hidden resize-y hover:border-blue-300 transition-colors" 
          style={{ height: '600px', minHeight: '300px' }}
        >
          {block.content ? (
            <>
              <iframe
                title={`Canva Embed ${block.id}`}
                src={block.content}
                className="absolute top-0 left-0 w-full h-full border-none pointer-events-auto"
                allow="fullscreen"
                allowFullScreen
              />
              {/* Corner drag indicator */}
              {!isLocked && (
                <div className="absolute bottom-0 right-0 w-4 h-4 cursor-ns-resize pointer-events-none z-20 flex items-center justify-center opacity-50">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15L15 21M21 8L8 21"/></svg>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
              <span className="font-medium flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                Paste Canva Smart Embed URL here
              </span>
            </div>
          )}
        </div>
      )}
      {block.type === 'IMAGE_UPLOAD' && (
        <div 
          className="w-full relative rounded border border-zinc-300 bg-zinc-50 overflow-hidden resize-y hover:border-blue-300 transition-colors flex items-center justify-center" 
          style={{ height: block.content ? 'auto' : '300px', minHeight: '150px' }}
        >
          {block.content ? (
            <>
              <img 
                src={block.content} 
                alt="Uploaded block" 
                className="w-full h-full object-contain pointer-events-none"
              />
              {/* Corner drag indicator */}
              {!isLocked && (
                <div className="absolute bottom-0 right-0 w-4 h-4 cursor-ns-resize pointer-events-none z-20 flex items-center justify-center opacity-50 bg-white/50 rounded-tl-md backdrop-blur-sm">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15L15 21M21 8L8 21"/></svg>
                </div>
              )}
            </>
          ) : (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-6 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
              tabIndex={isLocked ? -1 : 0}
              onPaste={(e) => {
                if (isLocked) return;
                const items = e.clipboardData.items;
                for (let i = 0; i < items.length; i++) {
                  if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        updateBlock(block.id, { content: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                    break;
                  }
                }
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span className="font-medium text-sm text-zinc-500 mb-1">Click to upload or Ctrl+V to paste</span>
              <span className="text-xs text-zinc-400">JPG, PNG, GIF (Max 5MB)</span>
              {!isLocked && (
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        updateBlock(block.id, { content: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
      {block.type === 'PRICING_TABLE' && (
        <div className="w-full rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
          <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4">
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: jwTheme.typography.fontHeading }}>
              Investment Summary
            </h3>
          </div>
          <div className="p-6 flex flex-col gap-3">
            {proposal?.pricing?.map((item) => (
              <div key={item.id} className="flex items-start justify-between p-4 rounded-lg bg-zinc-50/50 border border-zinc-100 hover:border-blue-200 transition-colors group">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-2">
                    {item.isOptional && (
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 pointer-events-none opacity-60 shrink-0"
                        defaultChecked={false}
                        disabled
                      />
                    )}
                    {/* Editable service name */}
                    <input
                      type="text"
                      className="flex-1 font-semibold text-slate-900 bg-transparent border-none outline-none focus:ring-0 focus:bg-zinc-100 rounded px-1 -ml-1 transition-colors"
                      value={item.deliverable}
                      onChange={(e) => updatePricingItem(item.id, { deliverable: e.target.value })}
                      disabled={isLocked}
                      placeholder="Service name"
                    />
                    {item.isOptional && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium shrink-0">Optional Add-on</span>}
                    {/* Remove button */}
                    {!isLocked && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removePricingItem(item.id); }}
                        className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all shrink-0"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    )}
                  </div>
                  {/* Editable description */}
                  <input
                    type="text"
                    className="w-full text-sm text-slate-500 bg-transparent border-none outline-none focus:ring-0 focus:bg-zinc-100 rounded px-1 ml-6 transition-colors"
                    value={item.description}
                    onChange={(e) => updatePricingItem(item.id, { description: e.target.value })}
                    disabled={isLocked}
                    placeholder="Description..."
                  />
                </div>
                {/* Editable price */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    className="w-24 text-right font-semibold text-slate-900 bg-transparent border-none outline-none focus:ring-0 focus:bg-zinc-100 rounded px-1 transition-colors"
                    value={item.unitPrice}
                    onChange={(e) => updatePricingItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                    disabled={isLocked}
                    min={0}
                  />
                </div>
              </div>
            ))}

            {/* Add item button */}
            {!isLocked && (
              <button
                onClick={(e) => { e.stopPropagation(); addPricingItem({ id: crypto.randomUUID(), deliverable: 'New Service', description: '', quantity: 1, unitPrice: 0, isOptional: false }); }}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-indigo-600 transition-colors py-2 px-4 rounded-lg hover:bg-zinc-50 w-full"
              >
                <Plus size={14} weight="bold" />
                Add line item
              </button>
            )}

            {/* Total Readout */}
            <div className="mt-2 pt-4 border-t border-zinc-200 flex justify-between items-center px-4">
              <span className="text-slate-500 font-medium">Estimated Total</span>
              <span className="text-2xl font-bold" style={{ color: jwTheme.colors.primary }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(proposal?.totalValue || 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LiveCanvas: React.FC = () => {
  const { proposal, activeBlockId, setActiveBlockId } = useProposalStore();
  const isLocked = proposal?.status === 'ACCEPTED';

  return (
    <main 
      className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-8 md:p-12 flex justify-center items-start bg-transparent"
      onClick={() => setActiveBlockId(null)} // Click outside to deselect
      data-lenis-prevent="true"
    >
      
      {/* The Paper Document (US Letter/A4 aspect ratio approximate constraints) */}
      <div 
        className="w-full max-w-[816px] min-h-[1056px] bg-white shadow-xl rounded-sm ring-1 ring-black/5 overflow-hidden transition-all relative"
        onClick={(e) => e.stopPropagation()} // Prevent deselect when clicking paper
      >
        {/* Global Watermark */}
        {proposal?.companyLogo && (
          <div className="absolute top-10 right-10 opacity-20 pointer-events-none z-0 mix-blend-multiply grayscale">
            <img 
              src={proposal.companyLogo} 
              alt="Company Watermark" 
              className="max-h-40 w-auto object-contain"
            />
          </div>
        )}
        
        {(!proposal?.blocks || proposal.blocks.length === 0) ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 gap-4 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-lg font-medium text-zinc-600">This proposal is empty</p>
            <p className="max-w-xs leading-relaxed">Use the command center on the left to add your first content block and start building.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <SortableContext 
              items={proposal.blocks.map(b => b.id)} 
              strategy={verticalListSortingStrategy}
            >
              {proposal.blocks.map((block) => (
                <CanvasBlock 
                  key={block.id} 
                  block={block} 
                  isActive={block.id === activeBlockId}
                  onSelect={() => setActiveBlockId(block.id)}
                  isLocked={isLocked}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>

    </main>
  );
};

export default LiveCanvas;
