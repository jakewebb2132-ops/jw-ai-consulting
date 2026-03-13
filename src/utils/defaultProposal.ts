import { Proposal, ContentBlock, PricingItem } from '../types/proposal';

const today = new Date();
const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

export const defaultBlocks: ContentBlock[] = [
  {
    id: 'block-1-hero',
    orderIndex: 0,
    type: 'HEADING',
    content: 'Strategic AI Implementation Proposal for [Client Company Name]',
    designSettings: {
      theme: 'dark' // Suggests high-contrast hero
    }
  },
  {
    id: 'block-2-exec',
    orderIndex: 1,
    type: 'TEXT',
    content: `**Executive Summary**\n\nCurrent bottlenecks in your operations are limiting scalable growth. We understand that manual data processing and siloed information lead to slow decision cycles.\n\nOur custom AI solution will directly address these friction points. By deploying tailored intelligent agents, your team will dramatically reduce administrative overhead, unlocking a projected 40% increase in operational efficiency within the first two quarters.`,
  },
  {
    id: 'block-3-methodology',
    orderIndex: 2,
    type: 'CANVA_EMBED',
    content: '', // Ready for the Canva URL
  },
  {
    id: 'block-3b-methodtext',
    orderIndex: 3,
    type: 'TEXT',
    content: `**Implementation Methodology**\n\n- Phase 1: Data Auditing & Strategy (Weeks 1-2)\n- Phase 2: Agent Architecture & Model Selection (Weeks 3-5)\n- Phase 3: Integration & Testing (Weeks 6-7)\n- Phase 4: Team Training & Handoff (Week 8)`,
  },
  {
    id: 'block-4-pricing',
    orderIndex: 4,
    type: 'PRICING_TABLE',
    content: '',
  },
  {
    id: 'block-5-signoff',
    orderIndex: 5,
    type: 'TEXT',
    content: `**Next Steps**\n\nTo initiate this consulting engagement, please sign below. The first invoice will be generated upon signature to lock in your project timeline.`,
    designSettings: {
      theme: 'secondary-tint' // To use the secondary color at 10% opacity
    }
  }
];

export const defaultPricing: PricingItem[] = [
  {
    id: 'price-1',
    deliverable: 'Core AI Infrastructure Setup',
    description: 'Cloud environment provisioning, security auditing, and base model deployment.',
    quantity: 1,
    unitPrice: 15000,
    isOptional: false,
  },
  {
    id: 'price-2',
    deliverable: 'Custom Agent Development',
    description: 'Engineering and tuning of two specialized AI agents trained on proprietary company data.',
    quantity: 1,
    unitPrice: 25000,
    isOptional: false,
  },
  {
    id: 'price-3',
    deliverable: 'Ongoing Retainer & Maintenance',
    description: 'Monthly token usage management, agent fine-tuning, and priority support.',
    quantity: 1,
    unitPrice: 3500,
    isOptional: true,
  }
];

export const generateDefaultProposal = (): Proposal => ({
  id: crypto.randomUUID(),
  title: 'Consulting Proposal',
  status: 'DRAFT',
  createdAt: new Date(),
  updatedAt: new Date(),
  expirationDate: nextMonth,
  clientId: 'new-client',
  blocks: defaultBlocks,
  pricing: defaultPricing,
  totalValue: defaultPricing.reduce((acc, item) => !item.isOptional ? acc + (item.quantity * item.unitPrice) : acc, 0),
  viewCount: 0
});
