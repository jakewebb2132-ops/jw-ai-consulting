import React from 'react';
import TopNav from '../components/proposal/TopNav';
import CommandCenter from '../components/proposal/CommandCenter';
import LiveCanvas from '../components/proposal/LiveCanvas';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { useProposalStore } from '../store/proposalStore';
import { useState } from 'react';

const ProposalGenerator: React.FC = () => {
  const { proposal, reorderBlocks } = useProposalStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require a 5px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && proposal?.blocks) {
      const oldIndex = proposal.blocks.findIndex(b => b.id === active.id);
      const newIndex = proposal.blocks.findIndex(b => b.id === over.id);
      
      const newOrder = arrayMove(proposal.blocks, oldIndex, newIndex);
      reorderBlocks(newOrder);
    }
    
    setActiveId(null);
  };

  // Find the currently dragged block for the overlay
  const activeBlock = proposal?.blocks?.find(b => b.id === activeId);

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen w-full flex flex-col overflow-hidden bg-[#f0f4f8] text-[#0f172a]">
        <TopNav />
        <div className="flex-1 flex w-full h-[calc(100vh-4rem)]">
          <CommandCenter />
          <LiveCanvas />
        </div>
        
        <DragOverlay>
          {activeBlock ? (
            <div className="bg-white p-3 rounded-md shadow-2xl ring-2 ring-indigo-500 opacity-90 flex items-center gap-3">
              <span className="font-medium text-zinc-700 truncate max-w-[180px]">
                {activeBlock.type === 'HEADING' || activeBlock.type === 'TEXT' 
                  ? activeBlock.content || 'Empty block'
                  : activeBlock.type.replace('_', ' ')}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default ProposalGenerator;
