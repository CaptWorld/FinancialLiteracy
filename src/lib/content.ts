// Loads and parses all course content from /content. Lessons are Markdown with YAML frontmatter
// and a few custom blocks (:::hook, :::task, :::trap, :::example, :::note, :::checklive <link-id>,
// :::dive <title> for an optional deep dive that stays folded until opened).
import { parse as parseYaml } from 'yaml';
import { marked } from 'marked';

export interface LinkDef {
  id: string; url: string; title: string; publisher: string;
  kind: 'official' | 'resource' | 'tool';
  why: string; bias?: string; format?: string; verified_on: string; status: 'verified' | 'unverified';
}
export interface Card { id: string; q: string; a: string; lesson: string }
export interface QuizQ { id: string; q: string; options: string[]; answer: number; why: string; lesson: string }
export interface Lesson {
  id: string; module: number; order: number; title: string; summary: string; minutes: number; reviewed_on: string;
  cheatsheet: string[]; cards: Card[]; quiz: QuizQ[]; explain?: { prompt: string; model: string };
  deeper: string[]; html: string; raw: string; text: string; tasks: number;
}
export interface Module { id: number; title: string; blurb: string; status: 'ready' | 'next' }
export interface GlossaryTerm {
  term: string;
  /** One or two plain sentences: shown in the tap-a-word popup. */
  def: string;
  /** Optional longer explanation, shown on the glossary page ("Read more"). */
  more?: string;
  /** Other ways the term is written in lessons ("FDs", "fixed deposit"). */
  aliases?: string[];
  lesson?: string;
}
export interface Problem { id: string; module: number; title: string; question: string; solution: string; answer: string; tool?: string; value?: number; unit?: string; tolerance?: number; abs_tolerance?: number }
export interface Scenario { id: string; module: number; title: string; situation: string; options: { text: string; verdict: 'good' | 'ok' | 'bad'; feedback: string }[] }
export interface Blindspot { id: string; title: string; cost: number; why: string; lesson?: string }
export interface Prompt { id: string; title: string; when: string; text: string }

const rawLessons = import.meta.glob('/content/lessons/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const rawYaml = import.meta.glob('/content/*.yaml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const rawPages = import.meta.glob('/content/pages/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const y = <T>(name: string): T => parseYaml(rawYaml[`/content/${name}.yaml`] || '[]') as T;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function splitFrontmatter(raw: string): { meta: any; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  return { meta: parseYaml(m[1]) || {}, body: m[2] };
}

const BLOCK_LABEL: Record<string, string> = {
  hook: 'Start here', task: 'Do this now', trap: 'Trap to avoid', example: 'Worked example', note: 'Note', checklive: 'Check the live number'
};

/** Render lesson Markdown, expanding custom ::: blocks. */
export function renderMarkdown(body: string, links: Record<string, LinkDef>): string {
  const out: string[] = [];
  let taskNo = 0;
  const re = /^:::(\w+)(?:[ \t]+([^\n]*))?\n([\s\S]*?)^:::[ \t]*$/gm;
  let last = 0;
  for (let m; (m = re.exec(body)); ) {
    out.push(marked.parse(body.slice(last, m.index), { async: false }) as string);
    const [, type, arg, inner] = m;
    const innerHtml = marked.parse(inner, { async: false }) as string;
    if (type === 'checklive') {
      const l = links[(arg || '').trim()];
      const linkHtml = l
        ? `<a class="live-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.title)} ↗</a><span class="muted"> · ${esc(l.publisher)}</span>`
        : `<span class="bad">Missing link: ${esc(arg || '')}</span>`;
      out.push(`<aside class="block block-checklive" data-link="${esc((arg || '').trim())}"><div class="block-label">${BLOCK_LABEL.checklive}</div><p>${linkHtml}</p>${innerHtml}</aside>`);
    } else if (type === 'dive') {
      out.push(`<details class="dive"><summary><span class="dive-label">Go deeper</span><span class="dive-title">${esc(arg || 'More detail')}</span></summary><div class="dive-body">${innerHtml}</div></details>`);
    } else if (type === 'task') {
      const n = ++taskNo;
      out.push(`<aside class="block block-task"><div class="block-label">${esc(arg || BLOCK_LABEL.task)}</div>${innerHtml}<label class="task-done"><input type="checkbox" data-task="${n}"> I did this</label></aside>`);
    } else {
      out.push(`<aside class="block block-${esc(type)}"><div class="block-label">${esc(arg || BLOCK_LABEL[type] || type)}</div>${innerHtml}</aside>`);
    }
    last = m.index + m[0].length;
  }
  out.push(marked.parse(body.slice(last), { async: false }) as string);
  return out.join('\n');
}

const stripHtml = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();

export function parseLesson(raw: string, links: Record<string, LinkDef>): Lesson {
  const { meta, body } = splitFrontmatter(raw);
  const id = String(meta.id);
  const html = renderMarkdown(body, links);
  return {
    id, module: Number(meta.module), order: Number(meta.order || 0), title: String(meta.title), summary: String(meta.summary || ''),
    minutes: Number(meta.minutes || 10), reviewed_on: String(meta.reviewed_on || ''),
    cheatsheet: meta.cheatsheet || [],
    cards: (meta.cards || []).map((c: any, i: number) => ({ id: `${id}#c${i + 1}`, q: c.q, a: c.a, lesson: id })),
    quiz: (meta.quiz || []).map((q: any, i: number) => ({ id: `${id}#q${i + 1}`, q: q.q, options: q.options, answer: q.answer, why: q.why, lesson: id })),
    explain: meta.explain, deeper: meta.deeper || [], html, raw, text: stripHtml(html),
    tasks: (html.match(/data-task="/g) || []).length
  };
}

export interface ContentBundle {
  links: Record<string, LinkDef>; linkList: LinkDef[]; modules: Module[]; lessons: Lesson[];
  glossary: GlossaryTerm[]; problems: Problem[]; scenarios: Scenario[]; blindspots: Blindspot[]; prompts: Prompt[];
  pages: Record<string, { title: string; html: string; reviewed_on: string; raw: string }>;
}

/** Build the content bundle, applying any in-app edits (overrides keyed by lesson id or 'page:<name>'). */
export function buildContent(overrides: Record<string, string> = {}): ContentBundle {
  const linkList = y<LinkDef[]>('links');
  const links = Object.fromEntries(linkList.map((l) => [l.id, l]));
  const lessons: Lesson[] = [];
  for (const raw of Object.values(rawLessons)) {
    let l = parseLesson(raw, links);
    if (overrides[l.id]) {
      try { l = { ...parseLesson(overrides[l.id], links), id: l.id }; } catch { /* keep original if the edit is broken */ }
    }
    lessons.push(l);
  }
  lessons.sort((a, b) => a.module - b.module || a.order - b.order);
  const pages: ContentBundle['pages'] = {};
  for (const [path, raw0] of Object.entries(rawPages)) {
    const name = path.split('/').pop()!.replace(/\.md$/, '');
    const raw = overrides[`page:${name}`] || raw0;
    const { meta, body } = splitFrontmatter(raw);
    pages[name] = { title: meta.title || name, reviewed_on: String(meta.reviewed_on || ''), html: renderMarkdown(body, links), raw };
  }
  return {
    links, linkList, lessons, pages,
    modules: y<Module[]>('modules'), glossary: y<GlossaryTerm[]>('glossary'), problems: y<Problem[]>('problems'),
    scenarios: y<Scenario[]>('scenarios'), blindspots: y<Blindspot[]>('blindspots'), prompts: y<Prompt[]>('prompts')
  };
}

export function rawLessonById(id: string): string | undefined {
  return Object.values(rawLessons).find((r) => splitFrontmatter(r).meta.id === id);
}
export function rawPageByName(name: string): string | undefined {
  return rawPages[`/content/pages/${name}.md`];
}

/** Months between an ISO date and today. Used for the "check before trusting" badge. */
export function monthsSince(iso: string, now = new Date()): number {
  const d = new Date(iso + 'T00:00:00Z');
  if (isNaN(d.getTime())) return Infinity;
  return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
}
export const isStale = (iso: string, now = new Date()) => monthsSince(iso, now) > 12;
