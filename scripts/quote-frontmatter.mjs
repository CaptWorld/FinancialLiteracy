// Quotes lesson-header values that contain ": " (which breaks YAML), e.g.
//   why: The rule: do X        →   why: "The rule: do X"
// Only touches lessons whose header fails to parse. Usage: npm run fix-yaml
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'yaml';

const dir = 'content/lessons';
let fixed = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
  const path = `${dir}/${f}`;
  const text = readFileSync(path, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) continue;
  try { parse(m[1]); continue; } catch { /* needs fixing */ }
  const lines = m[1].split('\n').map((l) => {
    const kv = l.match(/^(\s*(?:- )?(?:title|summary|prompt|model|q|a|why): )(.*)$/);
    if (kv && kv[2].includes(': ') && !/^["'[|>]/.test(kv[2])) return kv[1] + JSON.stringify(kv[2]);
    const item = l.match(/^(\s+- )(.*)$/);
    if (item && item[2].includes(': ') && !/^["'[{]/.test(item[2]) && !/^\w+: /.test(item[2])) return item[1] + JSON.stringify(item[2]);
    return l;
  });
  const header = lines.join('\n');
  parse(header); // throws with a clear message if still broken
  writeFileSync(path, text.replace(m[1], () => header));
  console.log('fixed', f);
  fixed++;
}
console.log(fixed ? `${fixed} file(s) fixed` : 'all lesson headers parse');
