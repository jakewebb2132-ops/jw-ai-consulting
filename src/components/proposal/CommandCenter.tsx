import React from 'react';
import { useProposalStore } from '../../store/proposalStore';
import { ListDashes, TextT, Table, Image, PresentationChart, DotsSixVertical, LockKey, Trash } from 'phosphor-react';
import { BlockType, ContentBlock } from '../../types/proposal';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RichTextEditor from './RichTextEditor';

const getIconForType = (type: BlockType) => {
  switch (type) {
    case 'HEADING': return <TextT size={18} />;
    case 'TEXT': return <ListDashes size={18} />;
    case 'IMAGE_UPLOAD': return <Image size={18} />;
    case 'CANVA_EMBED': return <PresentationChart size={18} />;
    case 'PRICING_TABLE': return <Table size={18} />;
  }
};

const SortableSidebarItem = ({ block, isActive, onSelect, onRemove, isLocked }: { block: ContentBlock, isActive: boolean, onSelect: () => void, onRemove: () => void, isLocked?: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // When dragging, lower opacity locally since the DragOverlay handles the ghost element
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center justify-between p-3 bg-white border rounded-md shadow-sm transition-colors ${!isLocked && 'cursor-pointer'} ${
        isDragging ? 'border-indigo-400' : isActive ? 'border-blue-500 bg-blue-50/50' : 'border-zinc-200 hover:border-zinc-400'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* The dedicated drag handle */}
        <div 
          className={`${isLocked ? 'cursor-not-allowed opacity-30' : 'cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500'} p-1 -ml-2`}
          {...attributes}
          {...listeners}
        >
          <DotsSixVertical size={20} weight="bold" />
        </div>
        
        <div className="text-zinc-400">
          {getIconForType(block.type)}
        </div>
        <span className="text-sm font-medium text-zinc-700 truncate max-w-[150px]">
          {block.type === 'HEADING' || block.type === 'TEXT' 
            ? block.content || 'Empty block'
            : block.type.replace('_', ' ')}
        </span>
      </div>
      
      {!isLocked && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-zinc-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all shrink-0"
          title="Delete Section"
        >
          <Trash size={16} weight="bold" />
        </button>
      )}
    </div>
  );
};

const CommandCenter: React.FC = () => {
  const { 
    proposal, activeBlockId, setActiveBlockId, addBlock, updateBlock, removeBlock, updateProposalDetails,
    addPricingItem, updatePricingItem, removePricingItem
  } = useProposalStore();

  const handleAddBlock = (type: BlockType) => {
    addBlock({
      id: crypto.randomUUID(),
      type,
      content: type === 'HEADING' ? 'New Heading' : type === 'TEXT' ? 'Enter your text here...' : '',
    });
  };

  const activeBlock = proposal?.blocks.find(b => b.id === activeBlockId);
  const isLocked = proposal?.status === 'ACCEPTED';

  return (
    <aside 
      className="w-1/3 max-w-sm h-[calc(100vh-4rem)] overflow-y-auto border-r border-blue-100 bg-white/70 backdrop-blur-xl shadow-[2px_0_15px_-3px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-8 shrink-0 z-10 relative"
      data-lenis-prevent="true"
    >
      
      {/* Section: Global Settings */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Document Settings</h2>
        <div className={`bg-white p-4 border border-zinc-200 rounded-lg shadow-sm flex flex-col gap-4 ${isLocked ? 'opacity-70 pointer-events-none' : ''}`}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-600">Document Title</label>
            <input 
              type="text"
              className="w-full text-sm border border-zinc-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              value={proposal?.title || ''}
              onChange={(e) => updateProposalDetails({ title: e.target.value })}
              placeholder="e.g. Acme Corp Proposal"
              disabled={isLocked}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-600">Company Logo (Watermark)</label>
            <input 
              type="url"
              className="w-full text-sm border border-zinc-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              value={proposal?.companyLogo || ''}
              onChange={(e) => updateProposalDetails({ companyLogo: e.target.value })}
              placeholder="https://example.com/logo.png"
              disabled={isLocked}
            />
          </div>
        </div>
      </div>

      {/* Section: Block Library */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Add Section</h2>
        <div className="grid grid-cols-2 gap-2">
          {(['HEADING', 'TEXT', 'IMAGE_UPLOAD', 'CANVA_EMBED', 'PRICING_TABLE'] as BlockType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleAddBlock(type)}
              disabled={isLocked}
              className={`flex items-center gap-2 p-3 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-left transition-all ${
                isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-zinc-400 hover:shadow-sm text-zinc-700'
              }`}
            >
              {getIconForType(type)}
              <span className="truncate">{type.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section: Document Outline */}
      <div className="flex-1">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Document Outline</h2>
        
        {(!proposal?.blocks || proposal.blocks.length === 0) ? (
          <div className="text-sm text-zinc-400 p-4 border border-dashed border-zinc-300 rounded-lg text-center">
            Your document is empty. Add a section above to start building.
          </div>
        ) : (
          <div className="space-y-2">
            <SortableContext 
              items={proposal.blocks.map(b => b.id)} 
              strategy={verticalListSortingStrategy}
            >
              {proposal.blocks.map((block) => (
                <SortableSidebarItem 
                  key={block.id} 
                  block={block} 
                  isActive={block.id === activeBlockId}
                  onSelect={() => setActiveBlockId(block.id)}
                  onRemove={() => {
                    removeBlock(block.id);
                    if (activeBlockId === block.id) setActiveBlockId(null);
                  }}
                  isLocked={isLocked}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>

      {/* Active Block Editor (Settings for the currently selected block) */}
      <div className="pt-6 border-t border-zinc-200">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Block Settings</h2>
        
        {isLocked ? (
          <div className="text-sm bg-amber-50 text-amber-800 p-4 border border-amber-200 rounded-lg mb-4">
            <span className="font-bold flex items-center gap-2"><LockKey weight="fill" /> Document Locked</span>
            This proposal has been signed. You must duplicate it or create a new draft to modify contents.
          </div>
        ) : null}
        
        {!activeBlock ? (
          <div className="text-sm text-zinc-400 bg-white p-4 border border-zinc-200 rounded-lg text-center">
            Select a block from the outline or canvas to edit its properties.
          </div>
        ) : (
          <div className={`bg-white border border-zinc-200 rounded-lg shadow-sm flex flex-col ${isLocked ? 'opacity-70 pointer-events-none' : ''}`}>
            
            {/* Header & Delete Button */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <span className="text-indigo-500">{getIconForType(activeBlock.type)}</span>
                <span className="text-sm font-semibold text-zinc-800">{activeBlock.type.replace('_', ' ')}</span>
              </div>
              <button 
                onClick={() => {
                  removeBlock(activeBlock.id);
                  setActiveBlockId(null);
                }}
                disabled={isLocked}
                className="text-zinc-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                title="Delete block"
              >
                <Trash size={16} weight="bold" />
              </button>
            </div>

            {/* Form Fields mapped by Type */}
            <div className="p-4 flex flex-col gap-4">
              {(activeBlock.type === 'HEADING' || activeBlock.type === 'TEXT') && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-zinc-600">Content</label>
                  <div className={`w-full text-sm border border-zinc-300 rounded-md p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 bg-white min-h-[100px] overflow-y-auto ${isLocked ? 'opacity-50 cursor-not-allowed bg-zinc-50' : ''}`}>
                    <RichTextEditor 
                      content={activeBlock.content}
                      onChange={(html) => updateBlock(activeBlock.id, { content: html })}
                      isHeading={activeBlock.type === 'HEADING'}
                      disabled={isLocked}
                      placeholder="Enter text..."
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">Hint: You can also click directly on the canvas to type!</p>
                </div>
              )}

              {activeBlock.type === 'CANVA_EMBED' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-zinc-600">Canva Smart Embed URL</label>
                  <input 
                    type="url"
                    className="w-full text-sm border border-zinc-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={activeBlock.content}
                    onChange={(e) => updateBlock(activeBlock.id, { content: e.target.value })}
                    placeholder="https://www.canva.com/design/..."
                    disabled={isLocked}
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Paste the Smart Embed Link from Canva's Share menu.</p>
                </div>
              )}

              {activeBlock.type === 'IMAGE_UPLOAD' && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-zinc-600">Image Source (URL or File)</label>
                  <input 
                    type="url"
                    className="w-full text-sm border border-zinc-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={activeBlock.content.startsWith('data:') ? '' : activeBlock.content}
                    onChange={(e) => updateBlock(activeBlock.id, { content: e.target.value })}
                    placeholder="https://example.com/image.png"
                    disabled={isLocked}
                  />
                  <div 
                    className="relative w-full text-sm border border-dashed border-zinc-300 rounded-md p-4 flex flex-col items-center justify-center text-center hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                              updateBlock(activeBlock.id, { content: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                          break;
                        }
                      }
                    }}
                  >
                    <span className="text-zinc-500 font-medium pb-1">Click to upload or Ctrl+V to paste</span>
                    <span className="text-[10px] text-zinc-400">Accepts JPG, PNG, GIF, WebP</span>
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
                              updateBlock(activeBlock.id, { content: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {activeBlock.type === 'PRICING_TABLE' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-zinc-600">Line Items</label>
                    <button
                      onClick={() => addPricingItem({
                        id: crypto.randomUUID(),
                        deliverable: 'New Service',
                        description: '',
                        quantity: 1,
                        unitPrice: 0,
                        isOptional: false,
                      })}
                      disabled={isLocked}
                      className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-40"
                    >
                      + Add Item
                    </button>
                  </div>

                  {(!proposal?.pricing || proposal.pricing.length === 0) && (
                    <p className="text-xs text-zinc-400 italic text-center py-2">No line items yet. Click "+ Add Item" to start.</p>
                  )}

                  <div className="flex flex-col divide-y divide-zinc-100">
                    {proposal?.pricing.map((item) => (
                      <div key={item.id} className="py-3 flex flex-col gap-2">
                        {/* Row 1: Deliverable name + remove */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="flex-1 text-sm border border-zinc-200 rounded px-2 py-1 outline-none focus:border-indigo-400"
                            value={item.deliverable}
                            onChange={(e) => updatePricingItem(item.id, { deliverable: e.target.value })}
                            placeholder="Service name"
                          />
                          <button
                            onClick={() => removePricingItem(item.id)}
                            className="text-zinc-300 hover:text-red-500 transition-colors shrink-0"
                            title="Remove item"
                          >
                            <Trash size={14} weight="bold" />
                          </button>
                        </div>
                        {/* Row 2: Description */}
                        <input
                          type="text"
                          className="w-full text-xs border border-zinc-200 rounded px-2 py-1 outline-none focus:border-indigo-400 text-zinc-500"
                          value={item.description}
                          onChange={(e) => updatePricingItem(item.id, { description: e.target.value })}
                          placeholder="Brief description (optional)"
                        />
                        {/* Row 3: Qty × Price + Optional toggle */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <span className="shrink-0">Qty</span>
                            <input
                              type="number"
                              min={1}
                              className="w-12 text-xs border border-zinc-200 rounded px-1.5 py-1 outline-none focus:border-indigo-400 text-center"
                              value={item.quantity}
                              onChange={(e) => updatePricingItem(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                            />
                          </div>
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <span className="shrink-0">$</span>
                            <input
                              type="number"
                              min={0}
                              className="w-20 text-xs border border-zinc-200 rounded px-1.5 py-1 outline-none focus:border-indigo-400"
                              value={item.unitPrice}
                              onChange={(e) => updatePricingItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                              placeholder="0.00"
                            />
                          </div>
                          <label className="flex items-center gap-1 text-xs text-zinc-500 ml-auto cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isOptional}
                              onChange={(e) => updatePricingItem(item.id, { isOptional: e.target.checked })}
                              className="rounded accent-indigo-500"
                            />
                            Optional
                          </label>
                        </div>
                        {/* Row 4: Line total */}
                        <div className="text-xs text-right text-zinc-500">
                          Subtotal: <span className="font-semibold text-zinc-700">${(item.quantity * item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grand Total Summary */}
                  {(proposal?.pricing?.length ?? 0) > 0 && (
                    <div className="mt-2 pt-3 border-t border-zinc-200 flex items-center justify-between">
                      <span className="text-sm font-semibold text-zinc-700">Total Value</span>
                      <span className="text-base font-bold text-indigo-700">
                        ${proposal!.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>

    </aside>
  );
};

export default CommandCenter;
