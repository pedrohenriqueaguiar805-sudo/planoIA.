import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Wand2,
  Layers,
  CreditCard,
  Download,
  FileText,
  Plus,
  Search,
  Filter,
  Check,
  Copy,
  ArrowUpRight,
  Sliders,
  Trash2,
  ChevronRight,
  Sun,
  Moon,
  LayoutGrid,
  Columns,
  Building2,
  Target,
  Zap,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  AppState,
  BillingCycle,
  BrandProfile,
  CampaignObjective,
  Channel,
  ContentFormat,
  ContentPost,
  CopyFramework,
  FunnelStage,
  PostStatus,
  SingleCopyHistoryItem,
  SubscriptionTier,
  SubscriptionTierId,
  ToneOfVoice,
} from '../types';
import { SUBSCRIPTION_TIERS } from '../data/initialData';
import {
  generateEditorialCalendar,
  generateSingleCopyItem,
} from '../services/aiEngine';
import {
  exportPostsToCSV,
  exportPostsToMarkdown,
} from '../utils/exportUtils';

interface StudioWorkspaceProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onSelectPost: (post: ContentPost) => void;
  onOpenCheckout: (tier: SubscriptionTier) => void;
  onBackToLanding: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type StudioTab = 'generator' | 'calendar' | 'copylab' | 'brands' | 'billing';

const OBJECTIVES: CampaignObjective[] = [
  'Venda Direta & Conversão',
  'Crescimento de Audiência & Alcance',
  'Construção de Autoridade & Posicionamento',
  'Lançamento de Produto / Infoproduto',
  'Geração de Leads Qualificados (DM / WhatsApp)',
];

const TONES: ToneOfVoice[] = [
  'Consultivo & Autoridade',
  'Direto, Provocativo & Contrarian',
  'Empático, Acolhedor & Storytelling',
  'Dinâmico, Jovem & Criativo',
  'Executivo B2B & Dados',
];

const FRAMEWORKS: CopyFramework[] = [
  'PAS',
  'AIDA',
  'Contrarian',
  'Storytelling',
  'Lista Prática',
  'Prova Social',
];

export const StudioWorkspace: React.FC<StudioWorkspaceProps> = ({
  state,
  onUpdateState,
  onSelectPost,
  onOpenCheckout,
  onBackToLanding,
  darkMode,
  onToggleDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('generator');

  // Campaign Generator Form State
  const [daysCount, setDaysCount] = useState<7 | 15 | 30>(7);
  const [objective, setObjective] = useState<CampaignObjective>('Venda Direta & Conversão');
  const [focusTopic, setFocusTopic] = useState<string>('');
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(['instagram', 'linkedin']);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calendar Filters State
  const [calendarViewMode, setCalendarViewMode] = useState<'grid' | 'kanban'>('grid');
  const [funnelFilter, setFunnelFilter] = useState<'all' | FunnelStage>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | Channel>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Copy Lab State
  const [copyTemplate, setCopyTemplate] = useState<string>('Roteiro de Reels Magnético (60s)');
  const [copyFramework, setCopyFramework] = useState<CopyFramework>('PAS');
  const [copyTopic, setCopyTopic] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Brand Editor State
  const [isCreatingBrand, setIsCreatingBrand] = useState<boolean>(false);
  const [newBrandForm, setNewBrandForm] = useState<Omit<BrandProfile, 'id'>>({
    name: '',
    handle: '@',
    niche: '',
    targetAudience: '',
    mainPainPoint: '',
    productOffer: '',
    averageTicket: 'R$ 997',
    toneOfVoice: 'Consultivo & Autoridade',
    differentiator: '',
    primaryChannels: ['instagram'],
  });

  const activeBrand =
    state.brands.find((b) => b.id === state.activeBrandId) || state.brands[0];
  const currentTierObj =
    SUBSCRIPTION_TIERS.find((t) => t.id === state.currentTier) || SUBSCRIPTION_TIERS[1];

  const brandPosts = state.posts.filter((p) => p.brandId === activeBrand.id);

  const filteredPosts = brandPosts.filter((p) => {
    if (funnelFilter !== 'all' && p.funnel !== funnelFilter) return false;
    if (channelFilter !== 'all' && p.channel !== channelFilter) return false;
    if (
      searchQuery.trim() !== '' &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.caption.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const toggleChannel = (ch: Channel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleGenerateCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.currentTier === 'starter' && daysCount === 30) {
      showToast('O cronograma de 30 dias completos é exclusivo dos planos Pro e Scale. Gerando 15 dias ou faça upgrade!');
    }

    setIsGenerating(true);
    setTimeout(() => {
      const newPosts = generateEditorialCalendar({
        brand: activeBrand,
        daysCount,
        objective,
        focusTopic,
        channels: selectedChannels,
      });

      onUpdateState((prev) => ({
        ...prev,
        posts: [
          ...prev.posts.filter((p) => p.brandId !== activeBrand.id),
          ...newPosts,
        ],
        generationsCount: prev.generationsCount + newPosts.length,
      }));

      setIsGenerating(false);
      setActiveTab('calendar');
      showToast(`✨ Calendário de ${daysCount} dias gerado com sucesso para ${activeBrand.name}!`);
    }, 600);
  };

  const handleAddManualPost = () => {
    const nextDay = brandPosts.length + 1;
    const newPost: ContentPost = {
      id: `post-manual-${Date.now()}`,
      brandId: activeBrand.id,
      dayNumber: nextDay,
      dateISO: '2026-10-10',
      dayLabel: `Dia ${String(nextDay).padStart(2, '0')} • Extra`,
      bestTime: '12:00',
      channel: 'instagram',
      format: 'Carrossel',
      funnel: 'meio',
      status: 'ideia',
      framework: 'PAS',
      pillar: 'Pauta Personalizada',
      title: `Nova Pauta Estratégica para ${activeBrand.name}`,
      hooks: [
        `O segredo que poucos contam sobre ${activeBrand.niche.toLowerCase()}.`,
        `Como resolver ${activeBrand.mainPainPoint.split(',')[0].toLowerCase()} em 3 etapas práticas.`,
        `Por que nossos clientes do ${activeBrand.productOffer.split('(')[0].trim()} têm resultados mais rápidos.`,
      ],
      selectedHookIndex: 0,
      structure: [
        { label: 'Slide 01 (Capa)', content: 'Título impactante de abertura.' },
        { label: 'Slide 02 (Desenvolvimento)', content: 'Explicação do método e quebra de objeção.' },
        { label: 'Slide 03 (CTA)', content: 'Convite claro para comentar ou chamar no Direct.' },
      ],
      caption: `Escreva ou refine sua legenda com a barra de IA ao lado.\n\nOferta conectada: ${activeBrand.productOffer}.`,
      cta: 'Comente "QUERO" para receber mais informações no Direct.',
      visualBrief: 'Layout editorial limpo seguindo a identidade visual da marca.',
      hashtags: ['#estrategiadeconteudo', '#marketingdigital'],
      viralScore: 90,
    };

    onUpdateState((prev) => ({
      ...prev,
      posts: [newPost, ...prev.posts],
    }));
    onSelectPost(newPost);
  };

  const handleGenerateSingleCopy = (e: React.FormEvent) => {
    e.preventDefault();
    const item = generateSingleCopyItem(
      activeBrand,
      copyTemplate,
      copyTopic,
      copyFramework
    );
    onUpdateState((prev) => ({
      ...prev,
      singleCopies: [item, ...prev.singleCopies],
      generationsCount: prev.generationsCount + 1,
    }));
    setCopyTopic('');
    showToast('✨ Copy gerada com sucesso no Laboratório!');
  };

  const handleSendCopyToCalendar = (item: SingleCopyHistoryItem) => {
    const nextDay = brandPosts.length + 1;
    const format: ContentFormat = item.templateType.includes('Reels')
      ? 'Reels / Short'
      : item.templateType.includes('Carrossel')
      ? 'Carrossel'
      : item.templateType.includes('Stories')
      ? 'Sequência de Stories'
      : 'Post Único / Texto';

    const newPost: ContentPost = {
      id: `post-from-copy-${Date.now()}`,
      brandId: activeBrand.id,
      dayNumber: nextDay,
      dateISO: '2026-10-09',
      dayLabel: `Dia ${String(nextDay).padStart(2, '0')} • Lab`,
      bestTime: '18:00',
      channel: 'instagram',
      format,
      funnel: 'meio',
      status: 'producao',
      framework: item.framework,
      pillar: 'Copy Lab',
      title: item.topic,
      hooks: item.hooks,
      selectedHookIndex: 0,
      structure: [
        { label: 'Bloco Principal', content: item.body },
      ],
      caption: item.body,
      cta: item.cta,
      visualBrief: `Peça criada no Copy Lab (${item.templateType}).`,
      hashtags: ['#copywriting', '#conteudodigital'],
      viralScore: 92,
    };

    onUpdateState((prev) => ({
      ...prev,
      posts: [...prev.posts, newPost],
    }));
    showToast('📅 Copy adicionada ao Calendário Editorial!');
    setActiveTab('calendar');
  };

  const handleCreateNewBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.brands.length >= currentTierObj.limits.maxBrands) {
      const nextTier =
        state.currentTier === 'starter' ? SUBSCRIPTION_TIERS[1] : SUBSCRIPTION_TIERS[2];
      showToast(
        `Limite de ${currentTierObj.limits.maxBrands} marca(s) atingido no plano ${currentTierObj.name}. Faça upgrade para adicionar mais clientes!`
      );
      onOpenCheckout(nextTier);
      return;
    }

    const created: BrandProfile = {
      ...newBrandForm,
      id: `brand-${Date.now()}`,
      name: newBrandForm.name.trim() || 'Nova Marca',
    };

    const initialPosts = generateEditorialCalendar({
      brand: created,
      daysCount: 7,
      objective: 'Venda Direta & Conversão',
      focusTopic: '',
      channels: created.primaryChannels,
    });

    onUpdateState((prev) => ({
      ...prev,
      brands: [...prev.brands, created],
      activeBrandId: created.id,
      posts: [...prev.posts, ...initialPosts],
    }));

    setIsCreatingBrand(false);
    showToast(`✅ Marca "${created.name}" criada já com 7 dias de calendário inicial!`);
  };

  // Funnel stats for active brand
  const topoCount = brandPosts.filter((p) => p.funnel === 'topo').length;
  const meioCount = brandPosts.filter((p) => p.funnel === 'meio').length;
  const fundoCount = brandPosts.filter((p) => p.funnel === 'fundo').length;
  const approvedCount = brandPosts.filter(
    (p) => p.status === 'aprovado' || p.status === 'publicado'
  ).length;

  const funnelBadge = (funnel: FunnelStage) => {
    if (funnel === 'topo')
      return {
        label: 'Topo • Atração',
        cls: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20',
      };
    if (funnel === 'meio')
      return {
        label: 'Meio • Autoridade',
        cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
      };
    return {
      label: 'Fundo • Conversão',
      cls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    };
  };

  const statusBadge = (status: PostStatus) => {
    switch (status) {
      case 'ideia':
        return { label: 'Ideia', cls: 'bg-stone-200/80 text-stone-700 dark:bg-zinc-800 dark:text-zinc-300' };
      case 'producao':
        return { label: 'Em Produção', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' };
      case 'aprovado':
        return { label: 'Aprovado', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' };
      case 'publicado':
        return { label: 'Publicado', cls: 'bg-brand-500/15 text-brand-700 dark:text-brand-300' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-alabaster dark:bg-[#0C0C0E] text-charcoal dark:text-[#F4F4F6]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md px-4 py-3 rounded-xl bg-charcoal dark:bg-white text-white dark:text-charcoal text-xs font-semibold shadow-editorial-lg flex items-center gap-2.5 border border-stone-700">
          <Sparkles className="w-4 h-4 text-spark-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Navigation (256px) */}
      <aside className="w-full lg:w-64 shrink-0 bg-oatmeal/75 dark:bg-[#121216] border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-zinc-800 flex flex-col justify-between">
        <div className="p-4 space-y-5">
          {/* Top Brand Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 group text-left"
              title="Voltar para a Landing Page de Vendas"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-display font-extrabold text-sm">
                P<span className="text-spark-500">.</span>
              </div>
              <div>
                <span className="font-display font-extrabold text-lg tracking-tight text-charcoal dark:text-white">
                  planoIA<span className="text-brand-600">.</span>
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stoneMuted -mt-1">
                  Studio Workspace
                </span>
              </div>
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 text-slateInk dark:text-zinc-400 hover:text-charcoal dark:hover:text-white"
              title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Brand / Client Switcher */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#18181D] border border-stone-200/90 dark:border-zinc-800 shadow-editorial space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stoneMuted flex items-center gap-1">
                <Building2 className="w-3 h-3 text-brand-600" />
                Marca / Cliente Ativo
              </span>
              <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-semibold">
                {state.brands.length}/{currentTierObj.limits.maxBrands}
              </span>
            </div>

            <select
              value={activeBrand.id}
              onChange={(e) =>
                onUpdateState((prev) => ({ ...prev, activeBrandId: e.target.value }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold bg-alabaster dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              {state.brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.handle})
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-[11px] text-slateInk dark:text-zinc-400 pt-0.5">
              <span className="truncate">{activeBrand.niche}</span>
              <button
                onClick={() => {
                  setActiveTab('brands');
                  setIsCreatingBrand(true);
                }}
                className="text-brand-600 dark:text-brand-400 font-semibold hover:underline shrink-0 ml-2"
              >
                + Nova
              </button>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
            {[
              {
                id: 'generator',
                label: 'Gerador de Campanha IA',
                icon: Wand2,
                badge: 'IA',
              },
              {
                id: 'calendar',
                label: 'Calendário Editorial',
                icon: Calendar,
                badge: String(brandPosts.length),
              },
              {
                id: 'copylab',
                label: 'Laboratório de Copy',
                icon: FileText,
              },
              {
                id: 'brands',
                label: 'DNA da Marca & Clientes',
                icon: Sliders,
              },
              {
                id: 'billing',
                label: 'Assinatura & Camadas',
                icon: CreditCard,
                badge: currentTierObj.name.split(' ')[0],
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as StudioTab)}
                  className={`flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slateInk dark:text-zinc-400 hover:bg-stone-200/60 dark:hover:bg-zinc-800/70 hover:text-charcoal dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-200 dark:bg-zinc-800 text-slateInk dark:text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Subscription Tier Meter & Landing Switch */}
        <div className="hidden lg:block p-4 space-y-3 border-t border-stone-200 dark:border-zinc-800">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#18181D] border border-stone-200 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stoneMuted">
                Camada Ativa
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 uppercase">
                {currentTierObj.name}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slateInk dark:text-zinc-400">Pautas no Mês</span>
                <span className="font-semibold text-charcoal dark:text-white">
                  {state.generationsCount} / {currentTierObj.limits.maxPostsPerMonth}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (state.generationsCount / currentTierObj.limits.maxPostsPerMonth) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setActiveTab('billing')}
              className="w-full py-1.5 px-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 hover:bg-stone-200/60 dark:hover:bg-zinc-800 text-[11px] font-semibold text-brand-600 dark:text-brand-400 flex items-center justify-center gap-1 border border-stone-200/80 dark:border-zinc-800 transition-colors"
            >
              <span>Alterar Camada / Upgrade</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onBackToLanding}
            className="w-full py-2 px-3 rounded-lg text-xs font-medium text-slateInk dark:text-zinc-400 hover:text-charcoal dark:hover:text-white flex items-center justify-center gap-1.5 hover:bg-stone-200/50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Landing Page de Vendas</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Context Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-stoneMuted">
                <span>{activeBrand.name}</span>
                <span>•</span>
                <span className="text-brand-600 dark:text-brand-400 font-semibold">
                  {activeBrand.handle}
                </span>
                <span>•</span>
                <span>Ticket: {activeBrand.averageTicket}</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal dark:text-white mt-1">
                {activeTab === 'generator' && 'Estúdio de Planejamento & Campanha IA'}
                {activeTab === 'calendar' && `Calendário Editorial (${brandPosts.length} pautas)`}
                {activeTab === 'copylab' && 'Laboratório de Copywriting Avulso'}
                {activeTab === 'brands' && 'DNA da Marca & Perfis de Clientes'}
                {activeTab === 'billing' && 'Gestão de Assinatura em Camadas'}
              </h1>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => exportPostsToCSV(brandPosts, activeBrand)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#141417] hover:bg-stone-50 dark:hover:bg-zinc-800 text-xs font-semibold text-charcoal dark:text-zinc-200 shadow-editorial transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-brand-600" />
                <span>Exportar CSV</span>
              </button>

              <button
                onClick={() => exportPostsToMarkdown(brandPosts, activeBrand)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#141417] hover:bg-stone-50 dark:hover:bg-zinc-800 text-xs font-semibold text-charcoal dark:text-zinc-200 shadow-editorial transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-spark-600" />
                <span>Exportar p/ Notion (.md)</span>
              </button>
            </div>
          </div>

          {/* 3-Card KPI Summary Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stoneMuted">
                  Cronograma da Marca
                </span>
                <div className="font-mono font-extrabold text-2xl text-charcoal dark:text-white mt-0.5">
                  {brandPosts.length} pautas
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {approvedCount} prontas/aprovadas para postar
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stoneMuted">
                  Distribuição de Funil
                </span>
                <div className="flex items-center gap-2 mt-1 font-mono text-xs font-bold">
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300">
                    Topo: {topoCount}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    Meio: {meioCount}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    Fundo: {fundoCount}
                  </span>
                </div>
                <span className="text-xs text-slateInk dark:text-zinc-400 block mt-1">
                  Equilíbrio estratégico ativo
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stoneMuted">
                  Oferta Principal Conectada
                </span>
                <div className="font-display font-bold text-sm text-charcoal dark:text-white mt-0.5 line-clamp-1">
                  {activeBrand.productOffer}
                </div>
                <button
                  onClick={() => setActiveTab('brands')}
                  className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline mt-1 inline-block"
                >
                  Editar DNA da Marca →
                </button>
              </div>
              <div className="w-10 h-10 rounded-xl bg-spark-50 dark:bg-spark-500/10 flex items-center justify-center text-spark-600 dark:text-spark-500 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* TAB 1: GENERATOR & OVERVIEW */}
          {activeTab === 'generator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Cols: Campaign Briefing Studio */}
              <form
                onSubmit={handleGenerateCalendar}
                className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial space-y-5"
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-zinc-800 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold">
                      Motor Editorial IA 2.5
                    </span>
                    <h2 className="font-display font-bold text-lg text-charcoal dark:text-white">
                      Gerar Novo Cronograma Estratégico
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-alabaster dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-slateInk dark:text-zinc-400">
                    DNA: {activeBrand.name}
                  </span>
                </div>

                {/* Duration Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slateInk dark:text-zinc-400 mb-2">
                    1. Horizonte do Planejamento
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { days: 7 as const, label: '7 Dias', sub: 'Sprint Semanal' },
                      { days: 15 as const, label: '15 Dias', sub: 'Quinzena' },
                      { days: 30 as const, label: '30 Dias', sub: 'Mês Completo' },
                    ].map((opt) => (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() => setDaysCount(opt.days)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          daysCount === opt.days
                            ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 ring-1 ring-brand-600'
                            : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300'
                        }`}
                      >
                        <div className="font-mono font-bold text-sm text-charcoal dark:text-white">
                          {opt.label}
                        </div>
                        <div className="text-[11px] text-stoneMuted">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Objective Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slateInk dark:text-zinc-400 mb-2">
                    2. Objetivo Comercial da Campanha
                  </label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value as CampaignObjective)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-sm font-medium text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                  >
                    {OBJECTIVES.map((obj) => (
                      <option key={obj} value={obj}>
                        {obj}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Channels Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slateInk dark:text-zinc-400 mb-2">
                    3. Canais de Distribuição
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { id: 'instagram', label: 'Instagram (Reels, Carrossel & Stories)' },
                        { id: 'linkedin', label: 'LinkedIn (Artigos & B2B)' },
                        { id: 'tiktok', label: 'TikTok (Vídeos Curtos)' },
                        { id: 'youtube', label: 'YouTube Shorts' },
                      ] as { id: Channel; label: string }[]
                    ).map((ch) => {
                      const active = selectedChannels.includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => toggleChannel(ch.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            active
                              ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                              : 'border-stone-200 dark:border-zinc-800 bg-alabaster dark:bg-zinc-900 text-slateInk dark:text-zinc-400'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                          <span>{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Focus / Angle Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slateInk dark:text-zinc-400 mb-1.5">
                    4. Tema Central, Campanha ou Ângulo Específico (Opcional)
                  </label>
                  <input
                    type="text"
                    value={focusTopic}
                    onChange={(e) => setFocusTopic(e.target.value)}
                    placeholder={`Ex: Abertura de vagas de Outubro, Quebra de objeção de preço, ${activeBrand.productOffer.split('(')[0].trim()}...`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                  <p className="text-[11px] text-stoneMuted mt-1">
                    Deixe em branco para a IA usar automaticamente a Dor Principal e Oferta salvas no DNA da marca.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-editorial-md transition-all disabled:opacity-60"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>
                    {isGenerating
                      ? 'Estruturando Funil, Ganchos e Legendas...'
                      : `Gerar Calendário de ${daysCount} Dias + Copies Completas`}
                  </span>
                </button>
              </form>

              {/* Right 5 Cols: Active Brand DNA Summary & Quick Preview */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-stoneMuted">
                      Contexto Injetado na IA
                    </span>
                    <button
                      onClick={() => setActiveTab('brands')}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Personalizar DNA
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800">
                      <span className="font-mono text-[10px] uppercase text-stoneMuted block">
                        Público-Alvo (Persona)
                      </span>
                      <span className="text-charcoal dark:text-zinc-200 font-medium">
                        {activeBrand.targetAudience}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800">
                      <span className="font-mono text-[10px] uppercase text-stoneMuted block">
                        Dor Principal Atacada
                      </span>
                      <span className="text-charcoal dark:text-zinc-200 font-medium">
                        {activeBrand.mainPainPoint}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800">
                      <span className="font-mono text-[10px] uppercase text-stoneMuted block">
                        Mecanismo Único / Diferencial
                      </span>
                      <span className="text-charcoal dark:text-zinc-200 font-medium">
                        {activeBrand.differentiator}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Pautas Quick List */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-charcoal dark:text-white">
                      Próximas Pautas do Cronograma
                    </h3>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Ver todas ({brandPosts.length}) →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {brandPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        onClick={() => onSelectPost(post)}
                        className="p-3 rounded-xl bg-alabaster dark:bg-zinc-900/90 hover:bg-stone-200/50 dark:hover:bg-zinc-800 border border-stone-200/70 dark:border-zinc-800 cursor-pointer transition-all flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-stoneMuted">
                            <span className="font-bold text-charcoal dark:text-zinc-300">
                              {post.dayLabel}
                            </span>
                            <span>•</span>
                            <span className="uppercase">{post.channel}</span>
                            <span>•</span>
                            <span>{post.format}</span>
                          </div>
                          <div className="text-xs font-bold text-charcoal dark:text-white truncate mt-0.5">
                            {post.title}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stoneMuted shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDITORIAL CALENDAR (GRID & KANBAN) */}
          {activeTab === 'calendar' && (
            <div className="space-y-5">
              {/* Filter & View Controls Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stoneMuted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar pauta ou palavra..."
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-xs text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>

                  {/* Funnel Filter */}
                  <div className="flex items-center gap-1 bg-alabaster dark:bg-zinc-900 p-1 rounded-lg border border-stone-200 dark:border-zinc-800 text-xs">
                    {(
                      [
                        { id: 'all', label: 'Todo o Funil' },
                        { id: 'topo', label: 'Topo (Atração)' },
                        { id: 'meio', label: 'Meio (Autoridade)' },
                        { id: 'fundo', label: 'Fundo (Venda)' },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFunnelFilter(f.id)}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          funnelFilter === f.id
                            ? 'bg-white dark:bg-zinc-800 text-charcoal dark:text-white shadow-sm font-semibold'
                            : 'text-slateInk dark:text-zinc-400 hover:text-charcoal'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Channel Filter */}
                  <select
                    value={channelFilter}
                    onChange={(e) => setChannelFilter(e.target.value as 'all' | Channel)}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-xs font-medium text-charcoal dark:text-white"
                  >
                    <option value="all">Todos os Canais</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube Shorts</option>
                  </select>
                </div>

                {/* Right Controls: Grid vs Kanban + Add Manual Post */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center p-1 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800">
                    <button
                      onClick={() => setCalendarViewMode('grid')}
                      className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                        calendarViewMode === 'grid'
                          ? 'bg-white dark:bg-zinc-800 text-charcoal dark:text-white shadow-sm font-semibold'
                          : 'text-stoneMuted'
                      }`}
                      title="Visualização em Grade"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Grade</span>
                    </button>
                    <button
                      onClick={() => setCalendarViewMode('kanban')}
                      className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                        calendarViewMode === 'kanban'
                          ? 'bg-white dark:bg-zinc-800 text-charcoal dark:text-white shadow-sm font-semibold'
                          : 'text-stoneMuted'
                      }`}
                      title="Quadro Kanban por Status"
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Kanban</span>
                    </button>
                  </div>

                  <button
                    onClick={handleAddManualPost}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nova Pauta</span>
                  </button>
                </div>
              </div>

              {/* GRID VIEW */}
              {calendarViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPosts.map((post) => {
                    const fBadge = funnelBadge(post.funnel);
                    const sBadge = statusBadge(post.status);

                    return (
                      <div
                        key={post.id}
                        onClick={() => onSelectPost(post)}
                        className="group p-5 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 hover:border-brand-600 dark:hover:border-brand-500 shadow-editorial hover:shadow-editorial-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          {/* Top Metadata Row */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-charcoal dark:text-zinc-200">
                              {post.dayLabel}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${fBadge.cls}`}
                            >
                              {fBadge.label}
                            </span>
                          </div>

                          {/* Channel & Format */}
                          <div className="flex items-center gap-2 text-[11px] font-mono text-stoneMuted">
                            <span className="uppercase font-semibold text-brand-600 dark:text-brand-400">
                              {post.channel}
                            </span>
                            <span>•</span>
                            <span>{post.format}</span>
                            <span>•</span>
                            <span>{post.bestTime}</span>
                          </div>

                          {/* Title */}
                          <h3 className="font-display font-bold text-base text-charcoal dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>

                          {/* Hook Preview */}
                          <div className="p-2.5 rounded-xl bg-alabaster dark:bg-zinc-900/90 border border-stone-200/60 dark:border-zinc-800 text-xs text-slateInk dark:text-zinc-300 line-clamp-2 italic">
                            "{post.hooks[post.selectedHookIndex] || post.hooks[0]}"
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="pt-3 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${sBadge.cls}`}>
                            {sBadge.label}
                          </span>
                          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                            <span>Abrir Copy & Roteiro</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* KANBAN VIEW */}
              {calendarViewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(
                    [
                      { id: 'ideia', title: '💡 Ideia / Pauta' },
                      { id: 'producao', title: '✍️ Em Produção' },
                      { id: 'aprovado', title: '✅ Aprovado' },
                      { id: 'publicado', title: '🚀 Publicado' },
                    ] as { id: PostStatus; title: string }[]
                  ).map((col) => {
                    const colPosts = filteredPosts.filter((p) => p.status === col.id);
                    return (
                      <div
                        key={col.id}
                        className="p-3.5 rounded-2xl bg-oatmeal/60 dark:bg-[#121216] border border-stone-200 dark:border-zinc-800 space-y-3"
                      >
                        <div className="flex items-center justify-between px-1">
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-charcoal dark:text-zinc-200">
                            {col.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white dark:bg-zinc-800 text-charcoal dark:text-zinc-200">
                            {colPosts.length}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {colPosts.map((post) => (
                            <div
                              key={post.id}
                              onClick={() => onSelectPost(post)}
                              className="p-3.5 rounded-xl bg-white dark:bg-[#18181D] border border-stone-200 dark:border-zinc-800 hover:border-brand-600 cursor-pointer shadow-editorial space-y-2 transition-all"
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono text-stoneMuted">
                                <span>{post.dayLabel.split('•')[0]}</span>
                                <span className="uppercase text-brand-600 dark:text-brand-400 font-semibold">
                                  {post.format.split('/')[0]}
                                </span>
                              </div>
                              <div className="font-display font-bold text-xs text-charcoal dark:text-white line-clamp-2">
                                {post.title}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COPY LAB (LABORATÓRIO DE COPY AVULSA) */}
          {activeTab === 'copylab' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 5 Cols: Single Copy Generator */}
              <form
                onSubmit={handleGenerateSingleCopy}
                className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial space-y-4"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-spark-600 dark:text-spark-500 font-semibold">
                    Criação Instantânea sob Demanda
                  </span>
                  <h2 className="font-display font-bold text-lg text-charcoal dark:text-white">
                    Gerar Peça de Copy Avulsa
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                    Formato da Peça
                  </label>
                  <select
                    value={copyTemplate}
                    onChange={(e) => setCopyTemplate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-xs font-semibold text-charcoal dark:text-white"
                  >
                    <option>Roteiro de Reels Magnético (60s)</option>
                    <option>Carrossel de Retenção (7 Slides)</option>
                    <option>Sequência de 4 Stories de Conversão</option>
                    <option>Post LinkedIn / Artigo de Autoridade</option>
                    <option>Script de Anúncio (Tráfego Pago / Meta Ads)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                    Framework de Persuasão
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FRAMEWORKS.map((fw) => (
                      <button
                        key={fw}
                        type="button"
                        onClick={() => setCopyFramework(fw)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                          copyFramework === fw
                            ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                            : 'border-stone-200 dark:border-zinc-800 text-slateInk dark:text-zinc-400'
                        }`}
                      >
                        {fw}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                    Sobre qual assunto, dor ou oferta você quer falar?
                  </label>
                  <textarea
                    rows={3}
                    value={copyTopic}
                    onChange={(e) => setCopyTopic(e.target.value)}
                    placeholder={`Ex: Como resolver ${activeBrand.mainPainPoint.split(',')[0].toLowerCase()} sem perder tempo...`}
                    className="w-full p-3 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Copy com DNA de {activeBrand.name}</span>
                </button>
              </form>

              {/* Right 7 Cols: Generated Copies History */}
              <div className="lg:col-span-7 space-y-4">
                {state.singleCopies.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                          {item.templateType}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 dark:bg-zinc-800 text-slateInk dark:text-zinc-400">
                          Framework {item.framework}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-stoneMuted">
                        {item.createdAt}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-charcoal dark:text-white">
                      {item.topic}
                    </h3>

                    <pre className="p-3.5 rounded-xl bg-alabaster dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 text-xs font-sans whitespace-pre-wrap text-charcoal dark:text-zinc-200 leading-relaxed">
                      {item.body}
                    </pre>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.body);
                          setCopiedId(item.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 text-xs font-semibold text-charcoal dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 flex items-center gap-1.5"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Texto</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendCopyToCalendar(item)}
                        className="px-3 py-1.5 rounded-lg bg-charcoal dark:bg-brand-600 text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Enviar p/ Calendário</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BRAND DNA & MULTI-CLIENT PROFILES */}
          {activeTab === 'brands' && (
            <div className="space-y-6">
              {/* Brand Switcher Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {state.brands.map((b) => {
                  const isCurrent = b.id === activeBrand.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => {
                        onUpdateState((prev) => ({ ...prev, activeBrandId: b.id }));
                        setIsCreatingBrand(false);
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isCurrent && !isCreatingBrand
                          ? 'bg-white dark:bg-[#141417] border-2 border-brand-600 shadow-editorial-md'
                          : 'bg-white/70 dark:bg-[#141417]/70 border-stone-200 dark:border-zinc-800 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-brand-600 dark:text-brand-400 font-semibold">
                          {b.handle}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                            Ativa
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-base text-charcoal dark:text-white mt-1">
                        {b.name}
                      </h3>
                      <p className="text-xs text-slateInk dark:text-zinc-400 mt-1 line-clamp-1">
                        {b.niche}
                      </p>
                    </div>
                  );
                })}

                {/* Add New Brand Card */}
                <button
                  type="button"
                  onClick={() => setIsCreatingBrand(true)}
                  className="p-5 rounded-2xl border-2 border-dashed border-stone-300 dark:border-zinc-700 hover:border-brand-600 flex flex-col items-center justify-center text-center gap-1.5 text-slateInk dark:text-zinc-400 hover:text-brand-600 transition-all"
                >
                  <Plus className="w-6 h-6" />
                  <span className="font-display font-bold text-sm">
                    Adicionar Nova Marca / Cliente
                  </span>
                  <span className="text-[11px] font-mono">
                    Usando {state.brands.length} de {currentTierObj.limits.maxBrands} disponíveis no plano {currentTierObj.name}
                  </span>
                </button>
              </div>

              {/* Create New Brand Form OR Edit Active Brand Form */}
              {isCreatingBrand ? (
                <form
                  onSubmit={handleCreateNewBrand}
                  className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-3">
                    <h3 className="font-display font-bold text-lg text-charcoal dark:text-white">
                      Cadastrar Novo DNA de Marca / Cliente
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCreatingBrand(false)}
                      className="text-xs text-stoneMuted hover:text-charcoal"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Nome da Marca / Cliente *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Studio Pilates Vida"
                        value={newBrandForm.name}
                        onChange={(e) =>
                          setNewBrandForm({ ...newBrandForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        @Perfil / Handle
                      </label>
                      <input
                        type="text"
                        value={newBrandForm.handle}
                        onChange={(e) =>
                          setNewBrandForm({ ...newBrandForm, handle: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Ticket Médio da Oferta
                      </label>
                      <input
                        type="text"
                        value={newBrandForm.averageTicket}
                        onChange={(e) =>
                          setNewBrandForm({
                            ...newBrandForm,
                            averageTicket: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Nicho de Mercado *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Fisioterapia & Pilates Clínico"
                        value={newBrandForm.niche}
                        onChange={(e) =>
                          setNewBrandForm({ ...newBrandForm, niche: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Produto / Oferta Principal *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Plano Trimestral Coluna Sem Dor"
                        value={newBrandForm.productOffer}
                        onChange={(e) =>
                          setNewBrandForm({
                            ...newBrandForm,
                            productOffer: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                      Público-Alvo Ideal (Persona) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Profissionais que trabalham 8h sentados em home office e sentem dores lombares"
                      value={newBrandForm.targetAudience}
                      onChange={(e) =>
                        setNewBrandForm({
                          ...newBrandForm,
                          targetAudience: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Dor Principal do Cliente *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dor nas costas constante e falta de flexibilidade"
                        value={newBrandForm.mainPainPoint}
                        onChange={(e) =>
                          setNewBrandForm({
                            ...newBrandForm,
                            mainPainPoint: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Diferencial Único (Mecanismo) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Turmas de no máximo 3 alunos com avaliação biomecânica"
                        value={newBrandForm.differentiator}
                        onChange={(e) =>
                          setNewBrandForm({
                            ...newBrandForm,
                            differentiator: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm"
                  >
                    Salvar Marca e Gerar 7 Dias Iniciais
                  </button>
                </form>
              ) : (
                <div className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-zinc-800 pb-3">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-brand-600 dark:text-brand-400 font-semibold">
                        Configuração de Voz da Marca (Brand Voice)
                      </span>
                      <h3 className="font-display font-bold text-lg text-charcoal dark:text-white">
                        Editando DNA: {activeBrand.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => showToast('✅ Alterações do DNA da Marca salvas automaticamente!')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Salvo em Tempo Real</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Nome da Marca
                      </label>
                      <input
                        type="text"
                        value={activeBrand.name}
                        onChange={(e) =>
                          onUpdateState((prev) => ({
                            ...prev,
                            brands: prev.brands.map((b) =>
                              b.id === activeBrand.id ? { ...b, name: e.target.value } : b
                            ),
                          }))
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Nicho de Atuação
                      </label>
                      <input
                        type="text"
                        value={activeBrand.niche}
                        onChange={(e) =>
                          onUpdateState((prev) => ({
                            ...prev,
                            brands: prev.brands.map((b) =>
                              b.id === activeBrand.id ? { ...b, niche: e.target.value } : b
                            ),
                          }))
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Tom de Voz Principal
                      </label>
                      <select
                        value={activeBrand.toneOfVoice}
                        onChange={(e) =>
                          onUpdateState((prev) => ({
                            ...prev,
                            brands: prev.brands.map((b) =>
                              b.id === activeBrand.id
                                ? { ...b, toneOfVoice: e.target.value as ToneOfVoice }
                                : b
                            ),
                          }))
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      >
                        {TONES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Produto / Oferta Principal
                      </label>
                      <input
                        type="text"
                        value={activeBrand.productOffer}
                        onChange={(e) =>
                          onUpdateState((prev) => ({
                            ...prev,
                            brands: prev.brands.map((b) =>
                              b.id === activeBrand.id
                                ? { ...b, productOffer: e.target.value }
                                : b
                            ),
                          }))
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Ticket Médio
                      </label>
                      <input
                        type="text"
                        value={activeBrand.averageTicket}
                        onChange={(e) =>
                          onUpdateState((prev) => ({
                            ...prev,
                            brands: prev.brands.map((b) =>
                              b.id === activeBrand.id
                                ? { ...b, averageTicket: e.target.value }
                                : b
                            ),
                          }))
                        }
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                      Público-Alvo Ideal (Persona)
                    </label>
                    <textarea
                      rows={2}
                      value={activeBrand.targetAudience}
                      onChange={(e) =>
                        onUpdateState((prev) => ({
                          ...prev,
                          brands: prev.brands.map((b) =>
                            b.id === activeBrand.id
                              ? { ...b, targetAudience: e.target.value }
                              : b
                          ),
                        }))
                      }
                      className="w-full p-3 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Dor Principal Atacada
                      </label>
                      <textarea
                        rows={2}
                        value={activeBrand.mainPainPoint}
                        onChange={(e) =>
                          onUpdateState((prev) => ({
                            ...prev,
                            brands: prev.brands.map((b) =>
                              b.id === activeBrand.id
                                ? { ...b, mainPainPoint: e.target.value }
                                : b
                            ),
                          }))
                        }
                        className="w-full p-3 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                        Mecanismo Único / Diferencial Competitivo
                      </label>
                      <textarea
                        rows={2}
                        value={activeBrand.differentiator}
                        onChange={(e) =>
                          onUpdateState((prev) => ({
                            ...prev,
                            brands: prev.brands.map((b) =>
                              b.id === activeBrand.id
                                ? { ...b, differentiator: e.target.value }
                                : b
                            ),
                          }))
                        }
                        className="w-full p-3 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-charcoal dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SUBSCRIPTION TIERS & BILLING */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* Current Subscription Banner */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      ASSINATURA ATIVA • {state.billingCycle === 'annual' ? 'ANUAL (-20%)' : 'MENSAL'}
                    </span>
                    <span className="text-xs font-mono text-stoneMuted">
                      Renovação automática ativa
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold text-2xl text-charcoal dark:text-white">
                    Camada {currentTierObj.name} — R${' '}
                    {state.billingCycle === 'annual'
                      ? currentTierObj.annualMonthlyPrice
                      : currentTierObj.monthlyPrice}
                    /mês
                  </h2>
                  <p className="text-xs text-slateInk dark:text-zinc-400">
                    Capacidade liberada: Até {currentTierObj.limits.maxBrands}{' '}
                    {currentTierObj.limits.maxBrands === 1 ? 'DNA de Marca' : 'DNAs de Marca'} •{' '}
                    {currentTierObj.limits.maxPostsPerMonth} pautas/mês •{' '}
                    {currentTierObj.limits.teamSeats}{' '}
                    {currentTierObj.limits.teamSeats === 1 ? 'assento' : 'assentos de equipe'}
                  </p>
                </div>

                {/* Cycle Switcher */}
                <div className="flex items-center p-1 rounded-xl bg-alabaster dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800">
                  <button
                    onClick={() =>
                      onUpdateState((prev) => ({ ...prev, billingCycle: 'monthly' }))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      state.billingCycle === 'monthly'
                        ? 'bg-white dark:bg-zinc-800 text-charcoal dark:text-white shadow-sm'
                        : 'text-stoneMuted'
                    }`}
                  >
                    Mensal
                  </button>
                  <button
                    onClick={() =>
                      onUpdateState((prev) => ({ ...prev, billingCycle: 'annual' }))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      state.billingCycle === 'annual'
                        ? 'bg-white dark:bg-zinc-800 text-charcoal dark:text-white shadow-sm'
                        : 'text-stoneMuted'
                    }`}
                  >
                    Anual (-20% OFF)
                  </button>
                </div>
              </div>

              {/* 3 Tiers Comparison inside Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {SUBSCRIPTION_TIERS.map((tier) => {
                  const isCurrent = tier.id === state.currentTier;
                  const price =
                    state.billingCycle === 'annual'
                      ? tier.annualMonthlyPrice
                      : tier.monthlyPrice;

                  return (
                    <div
                      key={tier.id}
                      className={`p-6 rounded-2xl flex flex-col justify-between border transition-all ${
                        isCurrent
                          ? 'bg-white dark:bg-[#141417] border-2 border-brand-600 shadow-editorial-md'
                          : 'bg-white/80 dark:bg-[#141417]/80 border-stone-200 dark:border-zinc-800'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-xl text-charcoal dark:text-white">
                            {tier.name}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-600 text-white">
                              CAMADA ATUAL
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-1 font-mono">
                          <span className="text-xs text-stoneMuted">R$</span>
                          <span className="text-3xl font-extrabold text-charcoal dark:text-white">
                            {price}
                          </span>
                          <span className="text-xs text-stoneMuted">/mês</span>
                        </div>

                        <p className="text-xs text-slateInk dark:text-zinc-400 leading-relaxed">
                          {tier.tagline}
                        </p>

                        <ul className="space-y-2 pt-2 border-t border-stone-100 dark:border-zinc-800">
                          {tier.features.map((f, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-charcoal dark:text-zinc-300"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={() => onOpenCheckout(tier)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                            isCurrent
                              ? 'bg-stone-200/80 dark:bg-zinc-800 text-charcoal dark:text-zinc-200 hover:bg-stone-300'
                              : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                          }`}
                        >
                          {isCurrent
                            ? 'Renovar / Alterar Ciclo'
                            : `Mudar para Camada ${tier.name}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
