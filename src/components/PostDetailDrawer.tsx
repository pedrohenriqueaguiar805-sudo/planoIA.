import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Clock,
  Eye,
  Hash,
  Wand2,
  Layers,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import {
  BrandProfile,
  ContentPost,
  FunnelStage,
  PostStatus,
} from '../types';
import { RewriteAction, rewritePostCopy } from '../services/aiEngine';

interface PostDetailDrawerProps {
  post: ContentPost | null;
  brand: BrandProfile;
  onClose: () => void;
  onUpdatePost: (updated: ContentPost) => void;
  onDeletePost: (postId: string) => void;
}

const STATUS_OPTIONS: { value: PostStatus; label: string; color: string }[] = [
  { value: 'ideia', label: 'Ideia', color: 'bg-stone-200 text-stone-800 dark:bg-zinc-800 dark:text-zinc-300' },
  { value: 'producao', label: 'Em Produção', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
  { value: 'aprovado', label: 'Aprovado', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
  { value: 'publicado', label: 'Publicado', color: 'bg-brand-500/15 text-brand-700 dark:text-brand-300' },
];

const FUNNEL_OPTIONS: { value: FunnelStage; label: string }[] = [
  { value: 'topo', label: 'Topo • Atração & Alcance' },
  { value: 'meio', label: 'Meio • Autoridade & Método' },
  { value: 'fundo', label: 'Fundo • Oferta & Conversão' },
];

export const PostDetailDrawer: React.FC<PostDetailDrawerProps> = ({
  post,
  brand,
  onClose,
  onUpdatePost,
  onDeletePost,
}) => {
  const [copiedMode, setCopiedMode] = useState<'caption' | 'full' | null>(null);
  const [activeRewrite, setActiveRewrite] = useState<string | null>(null);

  if (!post) return null;

  const handleRewrite = (action: RewriteAction) => {
    setActiveRewrite(action);
    setTimeout(() => {
      const result = rewritePostCopy(post, brand, action);
      onUpdatePost({
        ...post,
        caption: result.caption,
        hooks: result.hooks || post.hooks,
        selectedHookIndex: result.hooks ? 0 : post.selectedHookIndex,
        framework: result.framework || post.framework,
      });
      setActiveRewrite(null);
    }, 320);
  };

  const handleCopyCaption = () => {
    const fullText = `${post.caption}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedMode('caption');
    setTimeout(() => setCopiedMode(null), 2000);
  };

  const handleCopyFullBrief = () => {
    const structureText = post.structure
      .map((s) => `• ${s.label}: ${s.content}`)
      .join('\n');
    const brief = [
      `📅 ${post.dayLabel} (${post.dateISO} às ${post.bestTime})`,
      `📱 Canal: ${post.channel.toUpperCase()} | Formato: ${post.format} | Funil: ${post.funnel.toUpperCase()}`,
      `🎯 Pauta: ${post.title}`,
      `🪝 Gancho Principal: "${post.hooks[post.selectedHookIndex] || post.hooks[0]}"`,
      '',
      '📐 ESTRUTURA DO CONTEÚDO:',
      structureText,
      '',
      '✍️ LEGENDA / COPY:',
      post.caption,
      '',
      `👉 CTA: ${post.cta}`,
      `🎨 Direção Visual: ${post.visualBrief}`,
      `#️⃣ Hashtags: ${post.hashtags.join(' ')}`,
    ].join('\n');

    navigator.clipboard.writeText(brief);
    setCopiedMode('full');
    setTimeout(() => setCopiedMode(null), 2000);
  };

  const handleStructureStepChange = (idx: number, content: string) => {
    const next = [...post.structure];
    next[idx] = { ...next[idx], content };
    onUpdatePost({ ...post, structure: next });
  };

  const handleAddStructureStep = () => {
    const nextNum = post.structure.length + 1;
    const next = [
      ...post.structure,
      {
        label: `Etapa 0${nextNum}`,
        content: 'Novo bloco de argumento ou chamada para ação.',
      },
    ];
    onUpdatePost({ ...post, structure: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[2px]">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="relative z-10 w-full max-w-xl bg-white dark:bg-[#141417] h-full border-l border-stone-200 dark:border-zinc-800 shadow-editorial-lg flex flex-col overflow-hidden">
        {/* Sticky Drawer Header */}
        <div className="px-6 py-4 bg-alabaster dark:bg-[#18181C] border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-charcoal text-white dark:bg-white dark:text-charcoal">
              {post.channel} • {post.format}
            </span>
            <span className="text-xs font-mono text-stoneMuted flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.dayLabel} • {post.bestTime}
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              ⚡ Score {post.viralScore}/100
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stoneMuted hover:text-charcoal dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Funnel Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-alabaster dark:bg-zinc-900/80 border border-stone-200/80 dark:border-zinc-800">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-stoneMuted mb-1.5">
                Status de Produção
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => onUpdatePost({ ...post, status: st.value })}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      post.status === st.value
                        ? `${st.color} ring-2 ring-brand-600/50`
                        : 'bg-white dark:bg-zinc-800 text-stoneMuted hover:text-charcoal dark:hover:text-white border border-stone-200 dark:border-zinc-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-stoneMuted mb-1.5">
                Etapa do Funil & Framework
              </label>
              <select
                value={post.funnel}
                onChange={(e) =>
                  onUpdatePost({ ...post, funnel: e.target.value as FunnelStage })
                }
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-charcoal dark:text-white"
              >
                {FUNNEL_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label} ({post.framework})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stoneMuted mb-1.5">
              Título / Pauta Estratégica
            </label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => onUpdatePost({ ...post, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-display font-bold text-base text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>

          {/* 3 Hooks Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-spark-600 dark:text-spark-500 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3 Opções de Gancho Magnético (Clique para selecionar)</span>
              </label>
            </div>

            <div className="space-y-2">
              {post.hooks.map((hook, idx) => {
                const isSelected = idx === post.selectedHookIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => onUpdatePost({ ...post, selectedHookIndex: idx })}
                    className={`p-3 rounded-xl border text-xs leading-relaxed cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-charcoal dark:text-white font-medium'
                        : 'border-stone-200 dark:border-zinc-800 bg-alabaster/60 dark:bg-zinc-900/40 text-slateInk dark:text-zinc-400 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                        isSelected
                          ? 'bg-brand-600 text-white font-bold'
                          : 'bg-stone-200 dark:bg-zinc-800 text-stoneMuted'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="flex-1">"{hook}"</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Structure (Slides / Script Steps) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-stoneMuted flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-600" />
                <span>Estrutura Passo a Passo ({post.format})</span>
              </label>
              <button
                type="button"
                onClick={handleAddStructureStep}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Bloco
              </button>
            </div>

            <div className="space-y-2">
              {post.structure.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-alabaster dark:bg-zinc-900/90 border border-stone-200/80 dark:border-zinc-800 space-y-1"
                >
                  <div className="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400">
                    {step.label}
                  </div>
                  <textarea
                    rows={2}
                    value={step.content}
                    onChange={(e) => handleStructureStepChange(idx, e.target.value)}
                    className="w-full text-xs bg-transparent text-charcoal dark:text-zinc-200 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* AI Copywriting Rewrite Toolbar */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-stoneMuted flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Refinar Copy com IA (1 Clique)</span>
              </label>
              {activeRewrite && (
                <span className="text-[11px] font-mono text-brand-600 animate-pulse">
                  Reescrevendo com DNA da marca...
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'magnetic_hook', label: '✨ + Gancho Magnético' },
                { id: 'pas_framework', label: '🔥 Aplicar PAS' },
                { id: 'aida_framework', label: '🎯 Aplicar AIDA' },
                { id: 'shorten', label: '✂️ Encurtar Copy' },
                { id: 'executive_tone', label: '💼 Tom Executivo B2B' },
                { id: 'direct_cta', label: '🚀 CTA de Fechamento' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleRewrite(btn.id as RewriteAction)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-brand-50/80 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200/70 dark:border-brand-800/60 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Full Editable Caption */}
            <div className="relative pt-1">
              <textarea
                rows={8}
                value={post.caption}
                onChange={(e) => onUpdatePost({ ...post, caption: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-charcoal dark:text-zinc-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <div className="flex justify-between text-[11px] font-mono text-stoneMuted mt-1">
                <span>Framework ativo: {post.framework}</span>
                <span>{post.caption.length} caracteres</span>
              </div>
            </div>
          </div>

          {/* CTA & Visual Direction */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stoneMuted mb-1">
                Chamada para Ação (CTA)
              </label>
              <input
                type="text"
                value={post.cta}
                onChange={(e) => onUpdatePost({ ...post, cta: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-charcoal dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stoneMuted mb-1 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Direção Visual / Sugestão de Design ou Gravação</span>
              </label>
              <textarea
                rows={2}
                value={post.visualBrief}
                onChange={(e) =>
                  onUpdatePost({ ...post, visualBrief: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-zinc-700 bg-alabaster dark:bg-zinc-900 text-slateInk dark:text-zinc-300"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stoneMuted mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                <span>Hashtags Estratégicas</span>
              </label>
              <input
                type="text"
                value={post.hashtags.join(' ')}
                onChange={(e) =>
                  onUpdatePost({
                    ...post,
                    hashtags: e.target.value.split(/\s+/).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-400"
              />
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="px-6 py-4 bg-alabaster dark:bg-[#18181C] border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onDeletePost(post.id);
              onClose();
            }}
            className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Excluir esta pauta"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 flex-1 justify-end">
            <button
              type="button"
              onClick={handleCopyCaption}
              className="px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-stone-50 text-xs font-semibold text-charcoal dark:text-zinc-200 flex items-center gap-1.5 transition-all"
            >
              {copiedMode === 'caption' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Legenda Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Legenda</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyFullBrief}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              {copiedMode === 'full' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Briefing Completo Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Briefing + Roteiro</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
