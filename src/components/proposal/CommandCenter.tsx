import React from 'react';
import { useProposalStore } from '../../store/proposalStore';
import { ListDashes, TextT, Table, Image, PresentationChart, DotsSixVertical, LockKey, Trash, GearSix } from 'phosphor-react';
import { BlockType, ContentBlock } from '../../types/proposal';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const getIconForType = (type: BlockType) => {
  switch (type) {
    case 'HEADING': return <TextT size={18} />;
    case 'TEXT': return <ListDashes size={18} />;
    case 'IMAGE_UPLOAD': return <Image size={18} />;
    case 'CANVA_EMBED': return <PresentationChart size={18} />;
    case 'PRICING_TABLE': return <Table size={18} />;
  }
};

const SortableSidebarItem = ({ block, isActive, onSelect, isLocked }: { block: ContentBlock, isActive: boolean, onSelect: () => void, isLocked?: boolean }) => {
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
    </div>
  );
};

const CommandCenter: React.FC = () => {
  const { proposal, activeBlockId, setActiveBlockId, addBlock, updateBlock, removeBlock, updateProposalDetails } = useProposalStore();

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
          <div className={`bg-white p-4 border border-zinc-200 rounded-lg shadow-sm flex flex-col gap-4 ${isLocked ? 'opacity-70 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-zinc-500"><GearSix size={18} /></span>
              <span className="text-sm font-semibold text-zinc-800">Global Settings</span>
            </div>
            
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
              <label className="text-xs font-medium text-zinc-600">Brand Watermark (Logo URL)</label>
              <input 
                type="url"
                className="w-full text-sm border border-zinc-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                value={proposal?.companyLogo || ''}
                onChange={(e) => updateProposalDetails({ companyLogo: e.target.value })}
                placeholder="https://example.com/logo.png"
                disabled={isLocked}
              />
              <p className="text-[10px] text-zinc-500 mt-1">Paste an image URL to embed it lightly in the top-right corner.</p>
            </div>
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
                  <textarea 
                    className="w-full text-sm border border-zinc-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none min-h-[100px]"
                    value={activeBlock.content}
                    onChange={(e) => updateBlock(activeBlock.id, { content: e.target.value })}
                    placeholder="Enter text..."
                    disabled={isLocked}
                  />
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
                <div className="text-xs text-zinc-500 italic p-2 bg-zinc-50 rounded border border-zinc-100">
                  Image upload pipeline would integrate here.
                </div>
              )}

              {activeBlock.type === 'PRICING_TABLE' && (
                <div className="text-xs text-zinc-500 italic p-2 bg-zinc-50 rounded border border-zinc-100">
                  Line items are managed via the pricing store engine.
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
