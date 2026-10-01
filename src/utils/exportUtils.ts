import { BrandProfile, ContentPost } from '../types';

export function exportPostsToCSV(posts: ContentPost[], brand: BrandProfile) {
  const headers = [
    'Dia',
    'Data',
    'Horario',
    'Canal',
    'Formato',
    'Etapa_Funil',
    'Status',
    'Framework',
    'Titulo_Pauta',
    'Gancho_Principal',
    'Legenda_Completa',
    'CTA',
    'Briefing_Visual',
    'Hashtags',
  ];

  const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;

  const rows = posts.map((p) => [
    escapeCsv(p.dayLabel),
    escapeCsv(p.dateISO),
    escapeCsv(p.bestTime),
    escapeCsv(p.channel.toUpperCase()),
    escapeCsv(p.format),
    escapeCsv(p.funnel.toUpperCase()),
    escapeCsv(p.status.toUpperCase()),
    escapeCsv(p.framework),
    escapeCsv(p.title),
    escapeCsv(p.hooks[p.selectedHookIndex] || p.hooks[0] || ''),
    escapeCsv(p.caption),
    escapeCsv(p.cta),
    escapeCsv(p.visualBrief),
    escapeCsv(p.hashtags.join(' ')),
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.href = url;
  link.setAttribute('download', `planoia-calendario-${slug}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPostsToMarkdown(posts: ContentPost[], brand: BrandProfile) {
  const lines: string[] = [
    `# 📅 Planejamento Editorial — ${brand.name} (${brand.handle})`,
    `> Gerado por **planoIA.** • Nicho: ${brand.niche} • Oferta: ${brand.productOffer}`,
    '',
    `## Resumo do DNA da Marca`,
    `- **Público-Alvo:** ${brand.targetAudience}`,
    `- **Dor Principal:** ${brand.mainPainPoint}`,
    `- **Diferencial Único:** ${brand.differentiator}`,
    `- **Tom de Voz:** ${brand.toneOfVoice}`,
    '',
    `---`,
    '',
    `## Cronograma de Publicações (${posts.length} pautas)`,
    '',
  ];

  posts.forEach((p) => {
    lines.push(`### ${p.dayLabel} (${p.dateISO} às ${p.bestTime}) — [${p.channel.toUpperCase()}] ${p.format}`);
    lines.push(`- **Pauta:** ${p.title}`);
    lines.push(`- **Funil:** ${p.funnel.toUpperCase()} | **Framework:** ${p.framework} | **Status:** ${p.status.toUpperCase()} | **Viral Score:** ${p.viralScore}/100`);
    lines.push(`- **Gancho Selecionado:** *"${p.hooks[p.selectedHookIndex] || p.hooks[0]}"*`);
    lines.push('');
    lines.push(`#### Estrutura do Conteúdo:`);
    p.structure.forEach((step) => {
      lines.push(`- **${step.label}:** ${step.content}`);
    });
    lines.push('');
    lines.push(`#### Copy / Legenda:`);
    lines.push('```text');
    lines.push(p.caption);
    lines.push('```');
    lines.push(`- **CTA:** ${p.cta}`);
    lines.push(`- **Direção Visual:** ${p.visualBrief}`);
    lines.push(`- **Hashtags:** ${p.hashtags.join(' ')}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.href = url;
  link.setAttribute('download', `planoia-notion-${slug}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
