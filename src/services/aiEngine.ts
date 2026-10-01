import {
  BrandProfile,
  CampaignObjective,
  Channel,
  ContentFormat,
  ContentPost,
  CopyFramework,
  FunnelStage,
  SingleCopyHistoryItem,
} from '../types';

interface GenerateCalendarInput {
  brand: BrandProfile;
  daysCount: 7 | 15 | 30;
  objective: CampaignObjective;
  focusTopic: string;
  channels: Channel[];
}

const WEEKDAYS_PT = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

const BEST_TIMES: Record<Channel, string[]> = {
  instagram: ['11:30', '12:15', '18:00', '19:30', '08:45'],
  linkedin: ['08:30', '09:15', '12:00', '17:30'],
  tiktok: ['12:30', '18:30', '20:00', '21:00'],
  youtube: ['12:00', '18:00', '19:00'],
};

interface BlueprintTemplate {
  funnel: FunnelStage;
  framework: CopyFramework;
  pillar: string;
  preferredFormat: ContentFormat;
  buildTitle: (b: BrandProfile, focus: string) => string;
  buildHooks: (b: BrandProfile, focus: string) => string[];
  buildStructure: (b: BrandProfile, focus: string, format: ContentFormat) => { label: string; content: string }[];
  buildCaption: (b: BrandProfile, focus: string, ctaKeyword: string) => string;
  buildCta: (b: BrandProfile, ctaKeyword: string) => string;
  buildVisual: (b: BrandProfile, format: ContentFormat) => string;
  viralScoreBase: number;
}

function getCtaKeyword(brand: BrandProfile, focus: string): string {
  const words = (focus || brand.productOffer || brand.niche)
    .toUpperCase()
    .replace(/[^A-ZÀ-Ú0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !['PARA', 'COMO', 'MAIS', 'PELO', 'SUAS', 'SEUS', 'COM'].includes(w));
  return words[0] || 'PLANO';
}

const BLUEPRINTS: BlueprintTemplate[] = [
  {
    funnel: 'topo',
    framework: 'Contrarian',
    pillar: 'Quebra de Crença & Atração',
    preferredFormat: 'Carrossel',
    viralScoreBase: 94,
    buildTitle: (b, focus) =>
      `Por que a forma tradicional de lidar com ${focus || b.niche.toLowerCase()} está travando seus resultados`,
    buildHooks: (b, focus) => [
      `A verdade desconfortável sobre ${focus || b.niche}: fazer o que todo mundo faz só te entrega o resultado mediano que todo mundo tem.`,
      `Se você é ${b.targetAudience.split(' ')[0].toLowerCase()} e ainda sofre com ${b.mainPainPoint.toLowerCase()}, o erro está nesta única etapa.`,
      `Pare de tentar resolver ${focus || b.niche.toLowerCase()} no esforço bruto antes de ajustar esta alavanca estratégica.`,
    ],
    buildStructure: (b, focus) => [
      {
        label: 'Slide 01 (Capa Magnética)',
        content: `Por que 85% do mercado de ${b.niche} continua preso em ${b.mainPainPoint.toLowerCase()} (e como virar esse jogo).`,
      },
      {
        label: 'Slide 02 (A Ilusão Comum)',
        content: `A maioria acredita que para resolver ${focus || b.mainPainPoint.toLowerCase()} basta trabalhar mais horas ou investir no escuro.`,
      },
      {
        label: 'Slide 03 (O Diagnóstico Real)',
        content: `Para ${b.targetAudience}, o verdadeiro gargalo não é falta de dedicação — é a ausência de um método previsível.`,
      },
      {
        label: 'Slide 04 (O Mecanismo Único)',
        content: `Nosso diferencial na ${b.name}: ${b.differentiator}.`,
      },
      {
        label: 'Slide 05 (A Virada de Chave)',
        content: `Quando você substitui o improviso pelo sistema do ${b.productOffer.split('(')[0].trim()}, o resultado deixa de ser sorte.`,
      },
      {
        label: 'Slide 06 (Convite / CTA)',
        content: `Salve este carrossel e comente a palavra-chave abaixo para aplicarmos essa estrutura no seu cenário.`,
      },
    ],
    buildCaption: (b, focus, kw) =>
      `A verdade que poucos falam no mercado de ${b.niche}: tentar resolver ${b.mainPainPoint.toLowerCase()} apenas repetindo fórmulas antigas custa caro.\n\nConversamos toda semana com ${b.targetAudience.toLowerCase()} que enfrentam exatamente esse cenário${focus ? ` quando o assunto é ${focus}` : ''}.\n\nNa ${b.name}, nós desenhamos um caminho diferente: ${b.differentiator}.\n\nÉ exatamente essa a base do nosso ${b.productOffer}.\n\nSalve este post para consultar depois e comente "${kw}" aqui embaixo se quiser receber nosso diagnóstico prático no Direct.`,
    buildCta: (_b, kw) => `Comente "${kw}" para receber o passo a passo no seu Direct.`,
    buildVisual: (b) =>
      `Carrossel editorial de alto contraste para ${b.name}, fundo limpo (#FAF9F5), tipografia bold no título e gráfico comparativo simples no Slide 3 ("Tentativa e Erro" vs "Método Validado").`,
  },
  {
    funnel: 'meio',
    framework: 'PAS',
    pillar: 'Diagnóstico & Autoridade',
    preferredFormat: 'Reels / Short',
    viralScoreBase: 91,
    buildTitle: (b, focus) =>
      `O protocolo de 3 passos para eliminar ${b.mainPainPoint.split(',')[0].toLowerCase()} com ${focus || b.niche}`,
    buildHooks: (b, focus) => [
      `Se você ainda perde tempo e margem com ${b.mainPainPoint.split(',')[0].toLowerCase()}, assista aos próximos 40 segundos.`,
      `3 sinais claros de que você precisa profissionalizar ${focus || b.niche.toLowerCase()} ainda neste mês.`,
      `Como nós resolvemos ${b.mainPainPoint.split(',')[0].toLowerCase()} para ${b.targetAudience.split('que')[0].trim()} sem complicação.`,
    ],
    buildStructure: (b, focus) => [
      {
        label: '[00s - 03s] Gancho de Retenção',
        content: `Olhar direto para a câmera com pergunta provocativa sobre ${b.mainPainPoint.split(',')[0].toLowerCase()}.`,
      },
      {
        label: '[03s - 15s] Problema & Agitação',
        content: `Contextualizar quanto custa ignorar ${focus || b.mainPainPoint.toLowerCase()} mês após mês na rotina de ${b.targetAudience.split('que')[0].trim()}.`,
      },
      {
        label: '[15s - 42s] Solução em 3 Passos',
        content: `Apresentar a lógica do ${b.productOffer.split('(')[0].trim()}: 1) Diagnóstico rápido, 2) Implementação guiada (${b.differentiator}), 3) Escala e acompanhamento.`,
      },
      {
        label: '[42s - 55s] Chamada para Ação',
        content: `Convite direto para comentar a palavra-chave ou chamar no link da bio.`,
      },
    ],
    buildCaption: (b, focus, kw) =>
      `Ignorar ${b.mainPainPoint.toLowerCase()} é um imposto invisível que você paga todos os meses.\n\nNo vídeo de hoje, abrimos os 3 pilares que utilizamos na ${b.name} para ajudar ${b.targetAudience.toLowerCase()} a conquistarem resultados reais${focus ? ` com foco em ${focus}` : ''}.\n\nNosso foco é simples: ${b.differentiator}.\n\nDigite "${kw}" nos comentários que nossa equipe te envia os detalhes do ${b.productOffer.split('(')[0].trim()} no Direct!`,
    buildCta: (_b, kw) => `Digite "${kw}" nos comentários para receber o material completo.`,
    buildVisual: () =>
      `Vídeo vertical (9:16) bem iluminado, cortes dinâmicos a cada 4s, legendas nativas destacando números e palavras de impacto.`,
  },
  {
    funnel: 'fundo',
    framework: 'AIDA',
    pillar: 'Oferta Direta & Conversão',
    preferredFormat: 'Sequência de Stories',
    viralScoreBase: 95,
    buildTitle: (b, focus) =>
      `Sequência de 5 Stories de Conversão: Convite aberto para ${b.productOffer.split('(')[0].trim()} (${focus || 'Vagas da Semana'})`,
    buildHooks: (b, focus) => [
      `Pergunta sincera para ${b.targetAudience.split('que')[0].trim()}: você já resolveu ${focus || b.mainPainPoint.split(',')[0].toLowerCase()} para este mês?`,
      `Abrimos vagas selecionadas esta semana para quem quer implementar ${b.productOffer.split('(')[0].trim()}.`,
      `Se você busca ${b.differentiator.toLowerCase()}, leia os próximos 4 stories com atenção.`,
    ],
    buildStructure: (b, focus) => [
      {
        label: 'Story 01 (Atenção + Enquete)',
        content: `Dor central em destaque: "${b.mainPainPoint.split(',')[0]}?" + Enquete interativa: "Já resolvi" vs "Preciso destravar agora".`,
      },
      {
        label: 'Story 02 (Interesse & Bastidor)',
        content: `Mostrar os bastidores de como o ${b.productOffer} funciona na prática para ${focus || b.niche}.`,
      },
      {
        label: 'Story 03 (Desejo & Diferencial)',
        content: `Destacar por que nosso modelo funciona: ${b.differentiator} (investimento médio: ${b.averageTicket}).`,
      },
      {
        label: 'Story 04 (Filtro de Perfil)',
        content: `Deixar claro para quem é (${b.targetAudience}) para atrair apenas leads prontos para decisão.`,
      },
      {
        label: 'Story 05 (Ação / Direct)',
        content: `Chamada final com sticker de resposta rápida ou link direto para WhatsApp/Direct.`,
      },
    ],
    buildCaption: (b, _focus, kw) =>
      `Roteiro estratégico de 5 Stories no modelo AIDA para gerar levantadas de mão imediatas para o ${b.productOffer}.\n\nDica de Ouro PlanoIA: após publicar o Story 01, monitore quem votar na segunda opção da enquete e inicie uma conversa consultiva no Direct em até 30 minutos oferecendo o diagnóstico.`,
    buildCta: (_b, kw) => `Responda este Story com "${kw}" para conversar com nosso time.`,
    buildVisual: () =>
      `Sequência visual minimalista combinando foto real de bastidores no fundo com caixas de texto legíveis e sticker de enquete nativa.`,
  },
  {
    funnel: 'meio',
    framework: 'Storytelling',
    pillar: 'Estudo de Caso & Prova Real',
    preferredFormat: 'Thread / Artigo',
    viralScoreBase: 89,
    buildTitle: (b, focus) =>
      `Bastidores reais: O que mudou quando aplicamos nosso método de ${focus || b.niche} na prática`,
    buildHooks: (b, focus) => [
      `Quando analisamos a rotina da maioria de ${b.targetAudience.split('que')[0].trim()}, encontramos sempre o mesmo padrão invisível.`,
      `Como transformar ${b.mainPainPoint.split(',')[0].toLowerCase()} em vantagem competitiva usando ${focus || b.niche.toLowerCase()}.`,
      `O antes e depois de substituir o improviso por uma estratégia estruturada na ${b.name}.`,
    ],
    buildStructure: (b, focus) => [
      {
        label: 'Bloco 1 (O Contexto Real)',
        content: `Apresentar a situação típica de quem sofre com ${b.mainPainPoint.toLowerCase()}.`,
      },
      {
        label: 'Bloco 2 (O Ponto de Inflexão)',
        content: `Mostrar por que as soluções genéricas falham e onde entra ${focus || b.differentiator}.`,
      },
      {
        label: 'Bloco 3 (A Execução Passo a Passo)',
        content: `Detalhar a metodologia por trás do ${b.productOffer} de forma transparente e educativa.`,
      },
      {
        label: 'Bloco 4 (Conclusão & Próximo Passo)',
        content: `Resumo da lição aprendida e convite elegante para diagnóstico individual.`,
      },
    ],
    buildCaption: (b, focus, kw) =>
      `Um dos maiores aprendizados que tivemos construindo a ${b.name} no mercado de ${b.niche} foi perceber que técnica sem clareza de processo não gera resultado sustentável.\n\nMuitos dos nossos clientes chegavam enfrentando exatamente o mesmo desafio: ${b.mainPainPoint.toLowerCase()}.\n\nQuando estruturamos o ${b.productOffer}${focus ? ` com foco total em ${focus}` : ''}, nossa prioridade foi garantir ${b.differentiator.toLowerCase()}.\n\nSe você sente que chegou a hora de dar esse próximo passo com segurança, envie "${kw}" por mensagem direta e vamos avaliar seu cenário.`,
    buildCta: (_b, kw) => `Envie "${kw}" na DM para agendarmos uma conversa estratégica.`,
    buildVisual: () =>
      `Fotografia autêntica de trabalho ou infográfico clean mostrando a jornada de transformação em 3 etapas.`,
  },
  {
    funnel: 'meio',
    framework: 'Lista Prática',
    pillar: 'Checklist Acionável & Salvamentos',
    preferredFormat: 'Carrossel',
    viralScoreBase: 93,
    buildTitle: (b, focus) =>
      `Checklist de 5 pontos para dominar ${focus || b.niche} sem cair em ${b.mainPainPoint.split(',')[0].toLowerCase()}`,
    buildHooks: (b, focus) => [
      `Salve este post antes da sua próxima semana: os 5 pilares indispensáveis de ${focus || b.niche}.`,
      `Use este checklist de 2 minutos para auditar se você está perdendo resultado com ${b.mainPainPoint.split(',')[0].toLowerCase()}.`,
      `O guia prático da ${b.name} para quem quer resultado real sem complicação técnica.`,
    ],
    buildStructure: (b, focus) => [
      {
        label: 'Slide 01 (Capa)',
        content: `O Checklist Definitivo de ${focus || b.niche}: 5 pontos que separam amadores de profissionais.`,
      },
      {
        label: 'Slide 02 (Ponto #1: Diagnóstico)',
        content: `Identifique onde ${b.mainPainPoint.split(',')[0].toLowerCase()} está drenando sua energia hoje.`,
      },
      {
        label: 'Slide 03 (Ponto #2: Posicionamento)',
        content: `Alinhe sua rotina ao perfil ideal: ${b.targetAudience.split('que')[0].trim()}.`,
      },
      {
        label: 'Slide 04 (Ponto #3: Diferenciação)',
        content: `Aplique o princípio central da ${b.name}: ${b.differentiator}.`,
      },
      {
        label: 'Slide 05 (Ponto #4 & #5: Escala)',
        content: `Padronize a entrega através do ${b.productOffer.split('(')[0].trim()} e acompanhe métricas semanalmente.`,
      },
      {
        label: 'Slide 06 (CTA de Salvamento)',
        content: `Salve este post nos favoritos e envie para um parceiro de negócios que precisa ver isso hoje.`,
      },
    ],
    buildCaption: (b, focus, kw) =>
      `Clareza de execução vale mais do que excesso de informação.\n\nPreparamos este checklist de 5 pontos baseado na nossa experiência prática na ${b.name} ajudando ${b.targetAudience.toLowerCase()} a superarem ${b.mainPainPoint.toLowerCase()}${focus ? ` em ${focus}` : ''}.\n\nQual desses 5 pontos é a sua prioridade número 1 nesta semana? Conta aqui nos comentários ou digite "${kw}" para conhecer o ${b.productOffer.split('(')[0].trim()}.`,
    buildCta: (_b, kw) => `Salve este post e comente "${kw}" para dar o próximo passo.`,
    buildVisual: () =>
      `Design estilo checklist interativo com ícones de verificação verde-esmeralda e numeração monoespaçada evidente.`,
  },
  {
    funnel: 'fundo',
    framework: 'Prova Social',
    pillar: 'Quebra de Objeção & Fechamento',
    preferredFormat: 'Post Único / Texto',
    viralScoreBase: 88,
    buildTitle: (b, focus) =>
      `Por que o custo de adiar a solução para ${b.mainPainPoint.split(',')[0].toLowerCase()} é maior que o investimento no ${b.productOffer.split('(')[0].trim()}`,
    buildHooks: (b, focus) => [
      `A pergunta não é quanto custa investir em ${focus || b.productOffer.split('(')[0].trim()}, mas quanto custa continuar mais 6 meses com ${b.mainPainPoint.split(',')[0].toLowerCase()}.`,
      `O que diferencia quem conquista resultados rápidos na ${b.name} de quem deixa para o mês que vem.`,
      `Por dentro do ${b.productOffer.split('(')[0].trim()}: como entregamos ${b.differentiator.toLowerCase()}.`,
    ],
    buildStructure: (b, focus) => [
      {
        label: 'Abertura (Ancoragem)',
        content: `Comparar o custo invisível de manter ${b.mainPainPoint.toLowerCase()} versus resolver com método.`,
      },
      {
        label: 'O Que Está Incluso',
        content: `Apresentar os pilares do ${b.productOffer} (${b.averageTicket}) com foco em ${focus || b.niche}.`,
      },
      {
        label: 'Garantia de Confiança & CTA',
        content: `Reforçar ${b.differentiator} e abrir canal direto para aplicação/compra.`,
      },
    ],
    buildCaption: (b, focus, kw) =>
      `Toda decisão importante envolve escolher entre dois custos: o custo da mudança ou o custo da estagnação.\n\nContinuar convivendo com ${b.mainPainPoint.toLowerCase()} cobra um preço alto na rotina de ${b.targetAudience.toLowerCase()}.\n\nPor isso criamos o ${b.productOffer}: uma solução desenhada com foco em ${b.differentiator.toLowerCase()}${focus ? ` e ${focus}` : ''}.\n\nSe você quer fazer parte dos próximos casos de sucesso da ${b.name}, toque no link da bio ou comente "${kw}" abaixo para falarmos diretamente com você.`,
    buildCta: (_b, kw) => `Comente "${kw}" ou clique no link da bio para falar com nossa equipe.`,
    buildVisual: () =>
      `Imagem institucional elegante com destaque tipográfico para o diferencial da oferta e selo de autoridade da marca.`,
  },
];

export function generateEditorialCalendar({
  brand,
  daysCount,
  objective,
  focusTopic,
  channels,
}: GenerateCalendarInput): ContentPost[] {
  const activeChannels: Channel[] =
    channels.length > 0 ? channels : brand.primaryChannels.length > 0 ? brand.primaryChannels : ['instagram'];
  const ctaKeyword = getCtaKeyword(brand, focusTopic);
  const startDate = new Date('2026-10-02T12:00:00Z');
  const generatedPosts: ContentPost[] = [];

  for (let i = 0; i < daysCount; i++) {
    const dayNum = i + 1;
    const postDate = new Date(startDate);
    postDate.setDate(startDate.getDate() + i);
    const dateISO = postDate.toISOString().split('T')[0];
    const weekdayName = WEEKDAYS_PT[postDate.getUTCDay()];
    const dayLabel = `Dia ${String(dayNum).padStart(2, '0')} • ${weekdayName}`;

    // Select blueprint based on campaign objective & day rhythm
    let blueprintIndex = i % BLUEPRINTS.length;
    if (objective === 'Venda Direta & Conversão' && i % 3 === 2) {
      blueprintIndex = i % 2 === 0 ? 2 : 5; // More bottom-of-funnel conversion posts
    } else if (objective === 'Crescimento de Audiência & Alcance' && i % 2 === 0) {
      blueprintIndex = i % 4 === 0 ? 0 : 4; // More top-of-funnel viral carousels & lists
    }

    const bp = BLUEPRINTS[blueprintIndex];
    const channel = activeChannels[i % activeChannels.length];
    const times = BEST_TIMES[channel];
    const bestTime = times[i % times.length];

    // Adapt format naturally to the channel
    let format: ContentFormat = bp.preferredFormat;
    if (channel === 'tiktok' || channel === 'youtube') {
      format = 'Reels / Short';
    } else if (channel === 'linkedin' && format === 'Sequência de Stories') {
      format = 'Thread / Artigo';
    }

    const topicContext =
      focusTopic.trim() !== ''
        ? focusTopic.trim()
        : i % 2 === 0
        ? brand.niche
        : brand.productOffer.split('(')[0].trim();

    const hooks = bp.buildHooks(brand, topicContext);
    const structure = bp.buildStructure(brand, topicContext, format);
    const caption = bp.buildCaption(brand, topicContext, ctaKeyword);
    const cta = bp.buildCta(brand, ctaKeyword);
    const visualBrief = bp.buildVisual(brand, format);

    const slugNiche = brand.niche
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

    const hashtags = [
      `#${slugNiche.slice(0, 18) || 'estrategia'}`,
      '#posicionamentodigital',
      '#conteudodevalor',
      `#${brand.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)}`,
    ];

    generatedPosts.push({
      id: `post-gen-${Date.now()}-${dayNum}`,
      brandId: brand.id,
      dayNumber: dayNum,
      dateISO,
      dayLabel,
      bestTime,
      channel,
      format,
      funnel: bp.funnel,
      status: dayNum <= 2 ? 'aprovado' : dayNum <= 4 ? 'producao' : 'ideia',
      framework: bp.framework,
      pillar: bp.pillar,
      title: bp.buildTitle(brand, topicContext),
      hooks,
      selectedHookIndex: 0,
      structure,
      caption,
      cta,
      visualBrief,
      hashtags,
      viralScore: Math.min(98, bp.viralScoreBase + ((i * 3) % 6) - 2),
    });
  }

  return generatedPosts;
}

export type RewriteAction =
  | 'magnetic_hook'
  | 'pas_framework'
  | 'aida_framework'
  | 'shorten'
  | 'executive_tone'
  | 'direct_cta';

export function rewritePostCopy(
  post: ContentPost,
  brand: BrandProfile,
  action: RewriteAction
): { caption: string; hooks?: string[]; framework?: CopyFramework } {
  const kw = getCtaKeyword(brand, post.title);
  const currentHook = post.hooks[post.selectedHookIndex] || post.hooks[0];

  switch (action) {
    case 'magnetic_hook': {
      const newHooks = [
        `9 em cada 10 profissionais de ${brand.niche} cometem esse erro silencioso todos os dias (e nem percebem).`,
        `Se você quer resultados reais com ${brand.productOffer.split('(')[0].trim()}, esqueça a regra antiga e aplique isto hoje.`,
        `O que ninguém te conta sobre ${post.title.toLowerCase()}: a diferença entre estagnar e escalar está neste detalhe.`,
      ];
      const updatedCaption = `${newHooks[0]}\n\n${post.caption.split('\n\n').slice(1).join('\n\n')}`;
      return { caption: updatedCaption, hooks: newHooks };
    }
    case 'pas_framework': {
      const pasCaption = `PROBLEMA: Você dedica horas tentando melhorar seus resultados em ${brand.niche}, mas ainda esbarra em ${brand.mainPainPoint.toLowerCase()}.\n\nAGITAÇÃO: O maior perigo não é errar uma vez — é normalizar esse gargalo por meses enquanto concorrentes menos preparados fecham os clientes que deveriam ser seus.\n\nSOLUÇÃO: Na ${brand.name}, criamos o ${brand.productOffer} exatamente para virar essa chave com ${brand.differentiator.toLowerCase()}.\n\n👉 ${post.cta || `Comente "${kw}" para receber nosso diagnóstico no Direct.`}`;
      return { caption: pasCaption, framework: 'PAS' };
    }
    case 'aida_framework': {
      const aidaCaption = `⚡ ATENÇÃO: ${currentHook}\n\n🔍 INTERESSE: Quando analisamos os bastidores de ${brand.targetAudience.toLowerCase()}, descobrimos que 80% do resultado vem de ajustar o processo certo na hora certa.\n\n🔥 DESEJO: Imagine operar com ${brand.differentiator.toLowerCase()} através do nosso ${brand.productOffer.split('(')[0].trim()}.\n\n🚀 AÇÃO: ${post.cta || `Comente "${kw}" agora mesmo para conversar com nosso time no Direct.`}`;
      return { caption: aidaCaption, framework: 'AIDA' };
    }
    case 'shorten': {
      const shortCaption = `${currentHook}\n\nPara ${brand.targetAudience.toLowerCase()}, o segredo não é fazer mais coisas — é resolver ${brand.mainPainPoint.split(',')[0].toLowerCase()} com método validado.\n\nNa ${brand.name}, entregamos exatamente isso: ${brand.differentiator}.\n\n👉 ${post.cta}`;
      return { caption: shortCaption };
    }
    case 'executive_tone': {
      const execCaption = `Análise Estratégica • ${brand.name}\n\nNo cenário atual de ${brand.niche}, a eficiência operacional depende diretamente de eliminar ${brand.mainPainPoint.toLowerCase()}.\n\nNossa atuação junto a ${brand.targetAudience.toLowerCase()} comprova um princípio claro: ${brand.differentiator}.\n\nEstruturamos o ${brand.productOffer} para lideranças e decisores que priorizam previsibilidade e retorno sobre investimento.\n\nPara agendar uma avaliação executiva, envie "${kw}" via mensagem privada.`;
      return { caption: execCaption };
    }
    case 'direct_cta': {
      const ctaCaption = `${post.caption.trim()}\n\n────────────────────\n🔥 PRÓXIMO PASSO IMEDIATO:\nLiberamos 4 horários exclusivos nesta semana para implementar o ${brand.productOffer.split('(')[0].trim()} (Investimento médio: ${brand.averageTicket}).\nComente "${kw}" ou chame no link da bio antes que a agenda feche.`;
      return { caption: ctaCaption };
    }
  }
}

export function generateSingleCopyItem(
  brand: BrandProfile,
  templateType: string,
  topic: string,
  framework: CopyFramework
): SingleCopyHistoryItem {
  const cleanTopic = topic.trim() || `Como superar ${brand.mainPainPoint.split(',')[0].toLowerCase()} com segurança`;
  const kw = getCtaKeyword(brand, cleanTopic);

  const hooks = [
    `A verdade que ninguém te conta sobre ${cleanTopic.toLowerCase()} (e como aplicar ainda hoje).`,
    `Se você faz parte de ${brand.targetAudience.split('que')[0].trim()}, pare de ignorar este detalhe em ${cleanTopic.toLowerCase()}.`,
    `Como nós transformamos ${cleanTopic.toLowerCase()} em resultado previsível na ${brand.name}.`,
  ];

  let body = '';
  if (templateType.includes('Reels') || templateType.includes('TikTok')) {
    body = `[00s - 04s] GANCHO VISUAL & FALADO:\n"${hooks[0]}"\n\n[04s - 18s] CONTEXTO & DOR (${framework}):\nVocê já reparou como a maioria tenta resolver ${cleanTopic.toLowerCase()} no improviso e acaba caindo em ${brand.mainPainPoint.toLowerCase()}?\n\n[18s - 45s] O MÉTODO ${brand.name.toUpperCase()}:\nPara virar esse jogo, aplique 3 pilares:\n1. Diagnóstico claro da causa raiz\n2. Implementação focada em ${brand.differentiator.toLowerCase()}\n3. Consistência com o método do ${brand.productOffer.split('(')[0].trim()}\n\n[45s - 60s] CHAMADA PARA AÇÃO (CTA):\n"Quer aplicar isso com o nosso acompanhamento? Comente '${kw}' aqui embaixo que eu te envio o passo a passo no Direct!"`;
  } else if (templateType.includes('Carrossel')) {
    body = `SLIDE 01 (CAPA): ${hooks[0]}\n\nSLIDE 02 (O PROBLEMA): Por que tantos sofrem com ${brand.mainPainPoint.toLowerCase()} quando o assunto é ${cleanTopic}?\n\nSLIDE 03 (O ERRO CLÁSSICO): Tentar copiar estratégias genéricas que não foram pensadas para ${brand.targetAudience.toLowerCase()}.\n\nSLIDE 04 (A VIRADA DE CHAVE): Na ${brand.name}, nós aplicamos o princípio de ${brand.differentiator}.\n\nSLIDE 05 (PASSO PRÁTICO): Como o ${brand.productOffer.split('(')[0].trim()} estrutura essa solução em tempo recorde.\n\nSLIDE 06 (RESUMO EXECUTIVO): Menos tentativa e erro, mais método comprovado.\n\nSLIDE 07 (CTA): Salve este carrossel e comente "${kw}" para receber uma análise personalizada no Direct.`;
  } else if (templateType.includes('Stories')) {
    body = `STORY 01 (Abertura + Enquete):\n"Falando sério sobre ${cleanTopic}: hoje isso é um acelerador ou uma dor de cabeça para você?" [Enquete: "Já domino" / "Preciso resolver"]\n\nSTORY 02 (Aprofundamento):\n"Recebo dezenas de mensagens de ${brand.targetAudience.toLowerCase()} travados em ${brand.mainPainPoint.split(',')[0].toLowerCase()}."\n\nSTORY 03 (A Solução):\n"Mostrando aqui nos bastidores como resolvemos isso dentro do ${brand.productOffer} usando ${brand.differentiator.toLowerCase()}."\n\nSTORY 04 (Convite Direto):\n"Responda este story com a palavra '${kw}' que eu mesmo vou te explicar como funciona para o seu caso."`;
  } else {
    body = `${hooks[0]}\n\nQuando conversamos com ${brand.targetAudience.toLowerCase()}, o tema "${cleanTopic}" sempre aparece conectado a um desafio central: ${brand.mainPainPoint.toLowerCase()}.\n\nAplicando a estrutura ${framework}, nossa recomendação prática na ${brand.name} se resume a três movimentos:\n• Eliminar o ruído operacional que consome tempo sem gerar retorno\n• Focar no nosso diferencial central: ${brand.differentiator}\n• Estruturar o próximo passo através do ${brand.productOffer} (${brand.averageTicket})\n\nComente "${kw}" abaixo ou envie uma mensagem direta para conversarmos sobre o seu momento atual.`;
  }

  return {
    id: `copy-${Date.now()}`,
    brandId: brand.id,
    createdAt: 'Agora mesmo',
    templateType,
    topic: cleanTopic,
    framework,
    hooks,
    body,
    cta: `Comente "${kw}" para receber o diagnóstico completo no Direct.`,
  };
}
