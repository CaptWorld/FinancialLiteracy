// Validates all content so a broken edit is caught before deploy.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { splitFrontmatter } from '../src/lib/content';
import { variantsOf } from '../src/lib/terms';

const read = (p: string) => readFileSync(new URL(`../content/${p}`, import.meta.url), 'utf8');
const links = parse(read('links.yaml')) as any[];
const linkIds = new Set(links.map((l) => l.id));
const lessonFiles = readdirSync(new URL('../content/lessons', import.meta.url));
const lessons = lessonFiles.map((f) => ({ f, ...splitFrontmatter(read(`lessons/${f}`)) }));
const lessonIds = new Set(lessons.map((l) => l.meta.id));

describe('links', () => {
  it('have unique ids, https urls, dates and status', () => {
    expect(linkIds.size).toBe(links.length);
    for (const l of links) {
      expect(l.url, l.id).toMatch(/^https:\/\//);
      expect(l.verified_on, l.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(['verified', 'unverified']).toContain(l.status);
      expect(['official', 'resource', 'tool']).toContain(l.kind);
      expect(l.why, l.id).toBeTruthy();
    }
  });
});

describe('lessons', () => {
  it('have required fields and valid references', () => {
    expect(lessons.length).toBeGreaterThan(0);
    for (const { f, meta, body } of lessons) {
      for (const k of ['id', 'module', 'order', 'title', 'summary', 'minutes', 'reviewed_on']) expect(meta[k], `${f}.${k}`).toBeDefined();
      expect(String(meta.reviewed_on)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(meta.cards?.length, `${f} cards`).toBeGreaterThanOrEqual(3);
      expect(meta.quiz?.length, `${f} quiz`).toBeGreaterThanOrEqual(3);
      for (const q of meta.quiz) {
        expect(q.answer, `${f}: ${q.q}`).toBeGreaterThanOrEqual(0);
        expect(q.answer, `${f}: ${q.q}`).toBeLessThan(q.options.length);
        expect(q.why).toBeTruthy();
      }
      for (const d of meta.deeper || []) expect(linkIds.has(d), `${f} deeper ${d}`).toBe(true);
      for (const m of body.matchAll(/^:::checklive\s+(\S+)/gm)) expect(linkIds.has(m[1]), `${f} checklive ${m[1]}`).toBe(true);
      // every ::: block is closed
      const opens = (body.match(/^:::\w+/gm) || []).length;
      const closes = (body.match(/^:::\s*$/gm) || []).length;
      expect(closes, `${f} unclosed block`).toBe(opens);
      expect(meta.explain?.prompt && meta.explain?.model, `${f} explain`).toBeTruthy();
    }
  });
  it('have unique ids', () => {
    expect(lessonIds.size).toBe(lessons.length);
  });
});

describe('course structure', () => {
  const modules = parse(read('modules.yaml')) as any[];
  it('modules have unique ids and every lesson belongs to one', () => {
    const ids = new Set(modules.map((m) => m.id));
    expect(ids.size).toBe(modules.length);
    for (const { f, meta } of lessons) expect(ids.has(meta.module), `${f} module ${meta.module}`).toBe(true);
  });
  it('lesson orders are unique within a module', () => {
    const seen = new Set<string>();
    for (const { f, meta } of lessons) { const k = `${meta.module}:${meta.order}`; expect(seen.has(k), `${f} duplicate order`).toBe(false); seen.add(k); }
  });
  it('glossary terms are unique and shared words only span different modules', () => {
    const gl = parse(read('glossary.yaml')) as any[];
    const owner = new Map<string, any>();
    const mod = (g: any) => (String(g.lesson || '').match(/^m(\d+)-/) || [])[1] ?? 'none';
    expect(new Set(gl.map((g) => g.term)).size).toBe(gl.length);
    for (const g of gl) {
      expect(g.def, g.term).toBeTruthy();
      for (const v of variantsOf(g)) {
        const k = v.toLowerCase();
        const o = owner.get(k);
        // The same word may mean different things in different modules (EPS: pension vs earnings per share);
        // the popup then picks by module. Within one module it would be ambiguous.
        expect(o && o.term !== g.term && mod(o) === mod(g) ? `${v}: ${o.term} vs ${g.term}` : '').toBe('');
        if (!o) owner.set(k, g);
      }
    }
  });
});

describe('other content', () => {
  it('glossary, blindspots point to real lessons', () => {
    for (const g of parse(read('glossary.yaml'))) if (g.lesson) expect(lessonIds.has(g.lesson), g.term).toBe(true);
    const ids = (f: string) => (parse(read(f)) as any[]).map((x) => x.id);
    for (const f of ['blindspots.yaml', 'scenarios.yaml', 'problems.yaml']) expect(new Set(ids(f)).size, `${f} duplicate id`).toBe(ids(f).length);
    for (const b of parse(read('blindspots.yaml'))) {
      if (b.lesson) expect(lessonIds.has(b.lesson), b.id).toBe(true);
      expect(b.cost).toBeGreaterThanOrEqual(1);
      expect(b.cost).toBeLessThanOrEqual(5);
    }
  });
  it('scenarios have one good option and problems have solutions', () => {
    for (const s of parse(read('scenarios.yaml'))) expect(s.options.filter((o: any) => o.verdict === 'good').length, s.id).toBe(1);
    for (const p of parse(read('problems.yaml'))) {
      expect(p.solution && p.answer, p.id).toBeTruthy();
      if (p.value != null) expect(typeof p.value, p.id).toBe('number');
    }
  });
  it('prompts parse', () => {
    for (const p of parse(read('prompts.yaml'))) expect(p.text.length).toBeGreaterThan(50);
  });
});
