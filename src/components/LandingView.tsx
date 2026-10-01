import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Layers,
  Wand2,
  Check,
  ChevronDown,
  TrendingUp,
  Target,
  Users,
  Clock,
  FileText,
  Zap,
  ShieldCheck,
  Sun,
  Moon,
  Play,
} from 'lucide-react';
import {
  BillingCycle,
  BrandProfile,
  ContentPost,
  SubscriptionTier,
  SubscriptionTierId,
} from '../types';
import { SUBSCRIPTION_TIERS } from '../data/initialData';

interface LandingViewProps {
  brands: BrandProfile[];
  posts: ContentPost[];
  currentTier: SubscriptionTierId;
  billingCycle: BillingCycle;
  onChangeBillingCycle: (cycle: BillingCycle) => void;
  onOpenApp: (brandId?: string) => void;
  onSelectTierForCheckout: (tier: SubscriptionTier) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const FAQ_ITEMS = [
  {
    q: 'Qual a diferença entre usar o planoIA. e pedir posts avulsos no ChatGPT?',
    a: 'No ChatGPT comum, você perde horas explicando seu nicho toda vez e recebe textos genéricos com cara de robô ("No mundo digital de hoje..."). O planoIA. guarda o DNA da sua marca (persona, dor real, ticket médio, diferencial e oferta) e constrói um calendário equilibrado entre Topo (Atração), Meio (Autoridade) e Fundo de Funil (Venda Direta), já com ganchos de retenção, estrutura slide a slide e roteiros segundo a segundo.',
  },
  {
    q: 'Como funciona o modelo de assinatura em camadas (Starter, Pro e Scale)?',
    a: 'Você escolhe a camada ideal para o tamanho da sua operação: o plano Starter atende perfeitamente profissionais liberais e criadores solo (1 marca); o Pro Estrategista é voltado para infoprodutores, negócios digitais e social medias (até 5 marcas e 300 pautas/mês); e o Scale / Agência suporta até 25 clientes simultâneos com fluxo completo de aprovação e múltiplos assentos.',
  },
  {
    q: 'Posso exportar o calendário para apresentar aos meus clientes ou usar no Notion?',
    a: 'Sim! Com um clique você exporta todo o cronograma editorial em CSV (compatível com Excel e Google Sheets) ou em Markdown estruturado pronto para colar diretamente no Notion ou enviar para aprovação do cliente.',
  },
  {
    q: 'Quais formatos e redes sociais o motor de IA domina?',
    a: 'O planoIA. cria estruturas nativas para Instagram (Carrosséis de retenção, Roteiros de Reels, Sequências de 5 Stories de conversão e Posts Únicos), LinkedIn (Artigos executivos, Storytelling B2B e Threads), TikTok e YouTube Shorts.',
  },
  {
    q: 'Posso mudar de plano ou cancelar a assinatura quando quiser?',
    a: 'Totalmente. Você pode fazer upgrade instantâneo do Starter para o Pro ou Scale conforme sua carteira de clientes cresce, além de contar com garantia incondicional de 7 dias em qualquer camada.',
  },
];

export const LandingView: React.FC<LandingViewProps> = ({
  brands,
  posts,
  currentTier,
  billingCycle,
  onChangeBillingCycle,
  onOpenApp,
  onSelectTierForCheckout,
  darkMode,
  onToggleDarkMode,
}) => {
  const [previewBrandId, setPreviewBrandId] = useState<string>(brands[0]?.id || 'brand-1');
  const [selectedPreviewPostIndex, setSelectedPreviewPostIndex] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const previewBrand = brands.find((b) => b.id === previewBrandId) || brands[0];
  const previewPosts = posts.filter((p) => p.brandId === previewBrand?.id);
  const activePreviewPost = previewPosts[selectedPreviewPostIndex] || previewPosts[0] || posts[0];

  const funnelBadgeStyle = (funnel: string) => {
    if (funnel === 'topo')
      return 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20';
    if (funnel === 'meio')
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
  };

  const funnelLabel = (funnel: string) => {
    if (funnel === 'topo') return 'Topo • Atração';
    if (funnel === 'meio') return 'Meio • Autoridade';
    return 'Fundo • Conversão';
  };

  return (
    <div className="min-h-screen bg-alabaster dark:bg-[#0C0C0E] text-charcoal dark:text-[#F4F4F6] transition-colors">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 h-16 border-b border-stone-200/80 dark:border-zinc-800/80 bg-alabaster/85 dark:bg-[#0C0C0E]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-display font-extrabold text-lg shadow-sm group-hover:bg-brand-700 transition-colors">
                P<span className="text-spark-500">.</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-xl tracking-tight text-charcoal dark:text-white">
                  planoIA<span className="text-brand-600 dark:text-brand-500">.</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-zinc-800 text-slateInk dark:text-zinc-400">
                  v2.5
                </span>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slateInk dark:text-zinc-400">
              <a
                href="#funcionalidades"
                className="hover:text-charcoal dark:hover:text-white transition-colors"
              >
                Funcionalidades
              </a>
              <a
                href="#metodo"
                className="hover:text-charcoal dark:hover:text-white transition-colors"
              >
                Por que Funciona
              </a>
              <a
                href="#precos"
                className="hover:text-charcoal dark:hover:text-white transition-colors"
              >
                Planos & Preços
              </a>
              <a
                href="#faq"
                className="hover:text-charcoal dark:hover:text-white transition-colors"
              >
                Perguntas
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
              className="p-2 rounded-lg border border-stone-200 dark:border-zinc-800 text-slateInk dark:text-zinc-400 hover:text-charcoal dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onOpenApp()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-charcoal dark:text-zinc-200 hover:bg-stone-200/60 dark:hover:bg-zinc-800 transition-colors"
            >
              Entrar no Studio
            </button>

            <button
              onClick={() => onOpenApp()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
            >
              <span>Abrir App Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Asymmetric Split Hero */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-stone-200/80 dark:border-zinc-800/80">
        <div
          className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-30"
          style={{
            background:
              'radial-gradient(circle at 80% 15%, rgba(79, 70, 229, 0.10), transparent 50%), radial-gradient(circle at 20% 80%, rgba(234, 88, 12, 0.06), transparent 45%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-6 space-y-6 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/70">
                <Sparkles className="w-3.5 h-3.5 text-spark-600 dark:text-spark-500" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  Motor de Estratégia Editorial & Copy IA
                </span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[52px] leading-[1.08] tracking-[-0.03em] text-charcoal dark:text-white">
                Planeje 30 dias de conteúdo magnético e{' '}
                <span className="text-brand-600 dark:text-brand-400 underline decoration-spark-500/40 decoration-wavy underline-offset-8">
                  copies que vendem
                </span>{' '}
                em 2 minutos.
              </h1>

              <p className="text-base sm:text-lg text-slateInk dark:text-zinc-400 leading-relaxed max-w-xl">
                Chega de encarar a tela em branco ou receber textos robóticos. O{' '}
                <strong className="text-charcoal dark:text-zinc-200 font-semibold">planoIA.</strong>{' '}
                absorve o DNA da sua marca e estrutura calendários completos por etapa de funil — com ganchos virais, roteiros de Reels e carrosséis prontos para publicar.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => onOpenApp()}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-editorial-md transition-all"
                >
                  <Wand2 className="w-5 h-5" />
                  <span>Gerar Meu Cronograma no App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#precos"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-[#141417] hover:bg-stone-50 dark:hover:bg-zinc-800 text-charcoal dark:text-zinc-200 font-semibold text-sm transition-colors"
                >
                  <span>Ver Camadas de Assinatura</span>
                </a>
              </div>

              {/* Key Proof Metrics */}
              <div className="pt-6 border-t border-stone-200 dark:border-zinc-800/80 grid grid-cols-3 gap-4">
                <div>
                  <div className="font-mono font-bold text-xl sm:text-2xl text-charcoal dark:text-white">
                    14h/sem
                  </div>
                  <div className="text-xs text-slateInk dark:text-zinc-400 mt-0.5">
                    Economia média de criação
                  </div>
                </div>
                <div>
                  <div className="font-mono font-bold text-xl sm:text-2xl text-brand-600 dark:text-brand-400">
                    6 Frameworks
                  </div>
                  <div className="text-xs text-slateInk dark:text-zinc-400 mt-0.5">
                    PAS, AIDA, Contrarian & mais
                  </div>
                </div>
                <div>
                  <div className="font-mono font-bold text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400">
                    Funil 360°
                  </div>
                  <div className="text-xs text-slateInk dark:text-zinc-400 mt-0.5">
                    Atração, Autoridade e Venda
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Product Preview Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white dark:bg-[#141417] border border-stone-200/90 dark:border-zinc-800 shadow-editorial-lg overflow-hidden">
                {/* Preview Window Top Bar */}
                <div className="px-4 py-3 bg-oatmeal/70 dark:bg-[#18181C] border-b border-stone-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-mono font-medium text-slateInk dark:text-zinc-400">
                      Preview Interativo • Clique para testar um nicho:
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-semibold">
                    DEMO AO VIVO
                  </span>
                </div>

                {/* Brand Selector Tabs inside Hero Card */}
                <div className="px-4 pt-3 pb-2 bg-alabaster dark:bg-[#141417] border-b border-stone-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto">
                  {brands.map((b) => {
                    const active = b.id === previewBrand?.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setPreviewBrandId(b.id);
                          setSelectedPreviewPostIndex(0);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                          active
                            ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal shadow-sm'
                            : 'bg-stone-200/60 dark:bg-zinc-800/80 text-slateInk dark:text-zinc-400 hover:text-charcoal dark:hover:text-white'
                        }`}
                      >
                        {b.name}
                      </button>
                    );
                  })}
                </div>

                {/* Preview Body */}
                {previewBrand && activePreviewPost && (
                  <div className="p-5 space-y-4">
                    {/* Brand Context Summary Strip */}
                    <div className="p-3 rounded-xl bg-alabaster dark:bg-zinc-900/90 border border-stone-200/80 dark:border-zinc-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[11px] font-mono uppercase text-stoneMuted">
                          Nicho & Oferta Ativa
                        </div>
                        <div className="text-xs font-semibold text-charcoal dark:text-zinc-200 mt-0.5">
                          {previewBrand.niche} •{' '}
                          <span className="text-brand-600 dark:text-brand-400">
                            Ticket {previewBrand.averageTicket}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenApp(previewBrand.id)}
                        className="shrink-0 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        <span>Editar no Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Day Selector Pills */}
                    {previewPosts.length > 1 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {previewPosts.slice(0, 5).map((post, idx) => (
                          <button
                            key={post.id}
                            onClick={() => setSelectedPreviewPostIndex(idx)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 border ${
                              idx === selectedPreviewPostIndex
                                ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-semibold'
                                : 'border-stone-200 dark:border-zinc-800 text-slateInk dark:text-zinc-400 hover:border-stone-300'
                            }`}
                          >
                            {post.dayLabel.split('•')[0].trim()} • {post.format.split('/')[0].trim()}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Selected Post Detail Card */}
                    <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#18181C] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase bg-stone-100 dark:bg-zinc-800 text-charcoal dark:text-zinc-200">
                            {activePreviewPost.channel} • {activePreviewPost.format}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${funnelBadgeStyle(
                              activePreviewPost.funnel
                            )}`}
                          >
                            {funnelLabel(activePreviewPost.funnel)}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          ⚡ Viral Score: {activePreviewPost.viralScore}/100
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-charcoal dark:text-white leading-snug">
                        {activePreviewPost.title}
                      </h3>

                      {/* Hook Box */}
                      <div className="p-3 rounded-lg bg-spark-50/70 dark:bg-spark-500/10 border border-spark-100 dark:border-spark-500/20">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-spark-600 dark:text-spark-500 mb-1">
                          Gancho Magnético (Framework {activePreviewPost.framework})
                        </div>
                        <p className="text-xs font-medium text-charcoal dark:text-zinc-200 italic">
                          "{activePreviewPost.hooks[0]}"
                        </p>
                      </div>

                      {/* Structure Preview */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono uppercase text-stoneMuted">
                          Estrutura Gerada ({activePreviewPost.structure.length} etapas):
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                          {activePreviewPost.structure.slice(0, 3).map((step, i) => (
                            <div
                              key={i}
                              className="text-xs p-2 rounded bg-alabaster dark:bg-zinc-900/80 border border-stone-200/60 dark:border-zinc-800/80"
                            >
                              <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">
                                {step.label}:
                              </span>{' '}
                              <span className="text-slateInk dark:text-zinc-300">{step.content}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-zinc-800">
                        <span className="text-[11px] font-mono text-stoneMuted">
                          Horário ideal: {activePreviewPost.bestTime}
                        </span>
                        <button
                          onClick={() => onOpenApp(previewBrand.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-charcoal dark:bg-brand-600 hover:bg-brand-600 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Ver Legenda Completa e Editar no App</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: 3 Core Pillars */}
      <section id="funcionalidades" className="py-20 lg:py-24 border-b border-stone-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Arquitetura Pensada para Conversão
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-charcoal dark:text-white">
              Muito além de um gerador de legendas: seu estrategista editorial completo.
            </h2>
            <p className="text-sm sm:text-base text-slateInk dark:text-zinc-400">
              Construído especificamente para criadores de conteúdo, infoprodutores, consultores e agências que precisam transformar audiência em receita recorrente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-white">
                  1. Equilíbrio Inteligente de Funil 360°
                </h3>
                <p className="text-sm text-slateInk dark:text-zinc-400 leading-relaxed">
                  O maior erro no digital é só fazer post de dica (que não vende) ou só fazer panfleto (que derruba o engajamento). O planoIA distribui seu calendário automaticamente entre:
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-sky-500/10 text-sky-800 dark:text-sky-300">
                  <span className="font-semibold">Topo • Atração & Quebra de Crença</span>
                  <span className="font-mono font-bold">40%</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Meio • Autoridade & Método</span>
                  <span className="font-mono font-bold">35%</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                  <span className="font-semibold">Fundo • Oferta & Conversão Direta</span>
                  <span className="font-mono font-bold">25%</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-spark-50 dark:bg-spark-500/10 border border-spark-100 dark:border-spark-500/30 flex items-center justify-center text-spark-600 dark:text-spark-500">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-white">
                  2. Copywriting Multi-Formato Nativo
                </h3>
                <p className="text-sm text-slateInk dark:text-zinc-400 leading-relaxed">
                  Cada pauta do calendário já nasce com 3 opções de ganchos magnéticos, direção visual de design/gravação e estrutura completa adaptada ao formato:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-zinc-800/80 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800">
                  <div className="font-bold text-charcoal dark:text-white">Carrossel</div>
                  <div className="text-[11px] text-stoneMuted">Slide 01 ao 07</div>
                </div>
                <div className="p-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800">
                  <div className="font-bold text-charcoal dark:text-white">Reels / TikTok</div>
                  <div className="text-[11px] text-stoneMuted">Roteiro 00s-60s</div>
                </div>
                <div className="p-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800">
                  <div className="font-bold text-charcoal dark:text-white">Stories AIDA</div>
                  <div className="text-[11px] text-stoneMuted">Sequência de 5</div>
                </div>
                <div className="p-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800">
                  <div className="font-bold text-charcoal dark:text-white">LinkedIn B2B</div>
                  <div className="text-[11px] text-stoneMuted">Storytelling & Case</div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/70 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-charcoal dark:text-white">
                  3. DNA da Marca & Multi-Clientes
                </h3>
                <p className="text-sm text-slateInk dark:text-zinc-400 leading-relaxed">
                  Salve perfis completos de marcas ou clientes (público-alvo, dor principal, produto, ticket médio e tom de voz). Troque de cliente em 1 clique e gere planejamentos sob medida.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-stoneMuted">Fluxo de Status Editorial</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Kanban & Grid
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="px-2 py-1 rounded bg-stone-200/70 dark:bg-zinc-800 text-slateInk dark:text-zinc-300">
                    Ideia
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    Produção
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Aprovado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works / Comparison Section */}
      <section id="metodo" className="py-20 bg-oatmeal/60 dark:bg-[#101014] border-b border-stone-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-spark-600 dark:text-spark-500">
              Comparativo Real de Produtividade
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-charcoal dark:text-white">
              Por que 92% dos criadores abandonam planilhas comuns na segunda semana?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Old Way */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/70 dark:bg-[#141417]/70 border border-stone-200 dark:border-zinc-800 space-y-4">
              <div className="inline-block px-2.5 py-1 rounded text-xs font-mono font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400">
                MODO ANTIGO • IMPROVISO + PROMPTS SOLTOS
              </div>
              <h3 className="font-display font-bold text-xl text-charcoal dark:text-white">
                Planilhas vazias & textos genéricos de IA
              </h3>
              <ul className="space-y-3 text-sm text-slateInk dark:text-zinc-400 pt-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Perde 45 minutos às segundas-feiras decidindo "o que postar hoje".</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Publica apenas dicas soltas que geram curtidas de concorrentes, mas zero vendas no Direct.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Precisa reescrever tudo do ChatGPT porque o texto parece artificial e sem a voz da sua empresa.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Social medias e agências perdem horas formatando documentos para aprovação do cliente.</span>
                </li>
              </ul>
            </div>

            {/* New Way (planoIA.) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141417] border-2 border-brand-600 shadow-editorial-md space-y-4 relative">
              <div className="inline-block px-2.5 py-1 rounded text-xs font-mono font-semibold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                MÉTODO PLANOIA. • SISTEMA EDITORIAL COMERCIAL
              </div>
              <h3 className="font-display font-bold text-xl text-charcoal dark:text-white">
                Calendário orientado a receita em 120 segundos
              </h3>
              <ul className="space-y-3 text-sm text-charcoal dark:text-zinc-200 pt-2">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Gera 7, 15 ou 30 dias de pautas conectadas diretamente ao seu produto e ticket médio.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Aplica frameworks clássicos de copywriting (PAS, AIDA, Contrarian e Prova Social) sem jargão robótico.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Barra de Reescrita IA em 1 clique para encorpar argumentos, encurtar legendas ou deixar o tom executivo.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>Exportação limpa para CSV (Planilhas) e Markdown (Notion) pronta para o time ou cliente.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Tiers Section (Assinatura Recorrente em Camadas) */}
      <section id="precos" className="py-20 lg:py-28 border-b border-stone-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Assinatura Recorrente em Camadas
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-charcoal dark:text-white">
              Escolha a camada ideal para a sua escala de conteúdo.
            </h2>
            <p className="text-base text-slateInk dark:text-zinc-400">
              Comece como criador solo ou opere dezenas de clientes na sua agência. Upgrade ou downgrade a qualquer momento.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="pt-4 inline-flex items-center p-1.5 rounded-xl bg-stone-200/70 dark:bg-zinc-900 border border-stone-300/60 dark:border-zinc-800">
              <button
                onClick={() => onChangeBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-zinc-800 text-charcoal dark:text-white shadow-sm'
                    : 'text-slateInk dark:text-zinc-400 hover:text-charcoal'
                }`}
              >
                Ciclo Mensal
              </button>
              <button
                onClick={() => onChangeBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-white dark:bg-zinc-800 text-charcoal dark:text-white shadow-sm'
                    : 'text-slateInk dark:text-zinc-400 hover:text-charcoal'
                }`}
              >
                <span>Ciclo Anual</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold">
                  20% OFF (2 meses grátis)
                </span>
              </button>
            </div>
          </div>

          {/* 3 Subscription Tiers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {SUBSCRIPTION_TIERS.map((tier) => {
              const price =
                billingCycle === 'annual' ? tier.annualMonthlyPrice : tier.monthlyPrice;
              const isCurrent = currentTier === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-7 flex flex-col justify-between transition-all relative ${
                    tier.highlighted
                      ? 'bg-white dark:bg-[#141417] border-2 border-brand-600 shadow-editorial-lg lg:-translate-y-2'
                      : 'bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial'
                  }`}
                >
                  {tier.badge && (
                    <div
                      className={`absolute -top-3.5 left-6 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                        tier.highlighted
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-charcoal dark:bg-zinc-700 text-white'
                      }`}
                    >
                      {tier.badge}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-extrabold text-2xl text-charcoal dark:text-white">
                          {tier.name}
                        </h3>
                        {isCurrent && (
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                            Plano Ativo na Demo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slateInk dark:text-zinc-400 mt-1.5 min-h-[36px] leading-relaxed">
                        {tier.tagline}
                      </p>
                    </div>

                    {/* Price Display */}
                    <div className="pb-5 border-b border-stone-200 dark:border-zinc-800">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-mono text-slateInk dark:text-zinc-400">R$</span>
                        <span className="font-mono font-extrabold text-4xl sm:text-5xl tracking-tight text-charcoal dark:text-white">
                          {price}
                        </span>
                        <span className="text-xs font-mono text-stoneMuted">/mês</span>
                      </div>
                      <div className="text-[11px] font-mono text-stoneMuted mt-1">
                        {billingCycle === 'annual'
                          ? `Faturado anualmente (R$ ${price * 12}/ano) • Economia de R$ ${(tier.monthlyPrice - tier.annualMonthlyPrice) * 12}/ano`
                          : 'Cobrança mensal recorrente • Sem fidelidade'}
                      </div>
                    </div>

                    {/* Capacity Pills */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800">
                        <div className="text-[10px] text-stoneMuted uppercase">Marcas / Clientes</div>
                        <div className="font-bold text-charcoal dark:text-white mt-0.5">
                          Até {tier.limits.maxBrands} {tier.limits.maxBrands === 1 ? 'marca' : 'marcas'}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800">
                        <div className="text-[10px] text-stoneMuted uppercase">Volume Mensal</div>
                        <div className="font-bold text-charcoal dark:text-white mt-0.5">
                          {tier.limits.maxPostsPerMonth} pautas/mês
                        </div>
                      </div>
                    </div>

                    {/* Feature Checklist */}
                    <ul className="space-y-3 pt-1">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal dark:text-zinc-300">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8 space-y-2.5">
                    <button
                      onClick={() => onSelectTierForCheckout(tier)}
                      className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        tier.highlighted
                          ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                          : 'bg-charcoal hover:bg-stone-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white'
                      }`}
                    >
                      <span>
                        {isCurrent ? `Gerenciar Plano ${tier.name}` : `Assinar Camada ${tier.name}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-center font-mono text-stoneMuted">
                      Ativação imediata • 7 dias de garantia
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Dúvidas Frequentes
          </span>
          <h2 className="font-display font-bold text-3xl text-charcoal dark:text-white">
            Tudo sobre o funcionamento do planoIA.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-charcoal dark:text-white hover:bg-stone-50 dark:hover:bg-zinc-900/60 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stoneMuted shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slateInk dark:text-zinc-400 leading-relaxed border-t border-stone-100 dark:border-zinc-800/60">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-charcoal dark:bg-[#16161D] border border-stone-800 p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.45), transparent 70%)',
            }}
          />
          <div className="relative space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-brand-600/30 border border-brand-500/40 text-brand-200">
              Experimente o Studio Completo Agora
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              Pronto para substituir o improviso por um calendário que vende todos os dias?
            </h2>
            <p className="text-sm sm:text-base text-stone-300">
              Acesse o dashboard interativo do planoIA., personalize o DNA da sua marca e gere seu primeiro cronograma estratégico agora mesmo.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => onOpenApp()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg transition-all"
              >
                <Wand2 className="w-4 h-4" />
                <span>Acessar o Studio planoIA.</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-stone-200 dark:border-zinc-800 text-xs text-stoneMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center text-white font-display font-bold text-xs">
              P.
            </div>
            <span className="font-display font-bold text-charcoal dark:text-white">planoIA.</span>
            <span>— Micro SaaS de Planejamento Editorial & Copywriting IA</span>
          </div>
          <div className="flex items-center gap-6 font-mono">
            <button onClick={() => onOpenApp()} className="hover:text-charcoal dark:hover:text-white">
              Abrir Dashboard
            </button>
            <a href="#precos" className="hover:text-charcoal dark:hover:text-white">
              Assinaturas
            </a>
            <span>© 2026 planoIA. Brasil</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
