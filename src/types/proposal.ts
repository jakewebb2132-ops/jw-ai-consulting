export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  logoUrl?: string; // Optional client logo
}

export interface PricingItem {
  id: string;
  deliverable: string;
  description: string;
  quantity: number;
  unitPrice: number;
  isOptional: boolean; // Allows clients to toggle add-ons
}

export type BlockType = 'HEADING' | 'TEXT' | 'IMAGE_UPLOAD' | 'CANVA_EMBED' | 'PRICING_TABLE';

export interface ContentBlock {
  id: string;
  orderIndex: number; // Controls the drag-and-drop sorting
  type: BlockType;
  content: string; // Text content or Canva iframe URL
  designSettings?: {
    fullWidth?: boolean;
    padding?: string;
    theme?: 'light' | 'dark' | 'secondary-tint';
  };
}

export interface Proposal {
  id: string;
  title: string;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED';
  createdAt: Date;
  updatedAt: Date;
  expirationDate?: Date;
  clientId: string; // Relates to Client interface
  blocks: ContentBlock[]; // Array of dynamic sections
  pricing: PricingItem[]; // Array of deliverables
  totalValue: number; // Auto-calculated field
  viewCount: number; // Tracks number of times the magic link was opened

  // Sign-off tracking elements
  acceptedAt?: Date;
  signatureName?: string;
  signatureTitle?: string;

  // Global Branding
  companyLogo?: string;
}
