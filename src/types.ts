export type Channel = 'instagram' | 'linkedin' | 'tiktok' | 'youtube';

export type ContentFormat =
  | 'Reels / Short'
  | 'Carrossel'
  | 'Post Único / Texto'
  | 'Sequência de Stories'
  | 'Thread / Artigo';

export type FunnelStage = 'topo' | 'meio' | 'fundo';

export type PostStatus = 'ideia' | 'producao' | 'aprovado' | 'publicado';

export type CopyFramework =
  | 'AIDA'
  | 'PAS'
  | 'Storytelling'
  | 'Contrarian'
  | 'Lista Prática'
  | 'Prova Social';

export type ToneOfVoice =
  | 'Consultivo & Autoridade'
  | 'Direto, Provocativo & Contrarian'
  | 'Empático, Acolhedor & Storytelling'
  | 'Dinâmico, Jovem & Criativo'
  | 'Executivo B2B & Dados';

export type CampaignObjective =
  | 'Venda Direta & Conversão'
  | 'Crescimento de Audiência & Alcance'
  | 'Construção de Autoridade & Posicionamento'
  | 'Lançamento de Produto / Infoproduto'
  | 'Geração de Leads Qualificados (DM / WhatsApp)';

export interface ContentStructureStep {
  label: string;
  content: string;
}

export interface ContentPost {
  id: string;
  brandId: string;
  dayNumber: number;
  dateISO: string;
  dayLabel: string;
  bestTime: string;
  channel: Channel;
  format: ContentFormat;
  funnel: FunnelStage;
  status: PostStatus;
  framework: CopyFramework;
  pillar: string;
  title: string;
  hooks: string[];
  selectedHookIndex: number;
  structure: ContentStructureStep[];
  caption: string;
  cta: string;
  visualBrief: string;
  hashtags: string[];
  viralScore: number;
}

export interface BrandProfile {
  id: string;
  name: string;
  handle: string;
  niche: string;
  targetAudience: string;
  mainPainPoint: string;
  productOffer: string;
  averageTicket: string;
  toneOfVoice: ToneOfVoice;
  differentiator: string;
  primaryChannels: Channel[];
}

export type SubscriptionTierId = 'starter' | 'pro' | 'scale';
export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionTier {
  id: SubscriptionTierId;
  name: string;
  tagline: string;
  badge?: string;
  highlighted?: boolean;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  limits: {
    maxBrands: number;
    maxPostsPerMonth: number;
    copyLabRewrites: string;
    exportFormats: string[];
    teamSeats: number;
  };
  features: string[];
}

export interface SingleCopyHistoryItem {
  id: string;
  brandId: string;
  createdAt: string;
  templateType: string;
  topic: string;
  framework: CopyFramework;
  hooks: string[];
  body: string;
  cta: string;
}

export interface AISettings {
  mode: 'builtin' | 'openai';
  openaiApiKey: string;
  openaiModel: string;
}

export interface AppState {
  currentTier: SubscriptionTierId;
  billingCycle: BillingCycle;
  activeBrandId: string;
  brands: BrandProfile[];
  posts: ContentPost[];
  singleCopies: SingleCopyHistoryItem[];
  aiSettings: AISettings;
  generationsCount: number;
}
