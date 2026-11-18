import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile, readFile, rename, mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { parseLibrary } from '../tools/life-value/library.mjs';

const run = promisify(execFile);
const repo = 'eternity4719/HowToLiveBetter';
const root = resolve(import.meta.dirname, '../public/tools/life-value');

async function getJson(path) {
  const { stdout } = await run('curl', ['-fsSL', '--retry', '1', '--max-time', '20',
    'https://api.github.com/repos/' + repo + '/' + path], { maxBuffer: 12 * 1024 * 1024 });
  return JSON.parse(stdout);
}

const commit = await getJson('commits/' + encodeURIComponent(process.argv[2] ?? 'main'));
const sha = commit.sha;
const files = await getJson('contents/book?ref=' + sha);
const paths = [
  ...files.filter(file => /^\d+-.+\.md$/.test(file.name)).map(file => file.path),
  'README.md', 'LICENSE', 'LICENSE-CODE', 'tools/lib/book.mjs',
];
const staging = await mkdtemp(join(tmpdir(), 'still-life-sync-'));
try {
  for (let index = 0; index < paths.length; index += 4) {
    await Promise.all(paths.slice(index, index + 4).map(async path => {
      const file = await getJson('contents/' + path.split('/').map(encodeURIComponent).join('/') + '?ref=' + sha);
      if (file.encoding !== 'base64') throw new Error('Unsupported source encoding: ' + path);
      const target = join(staging, 'source', path);
      await mkdir(resolve(target, '..'), { recursive: true });
      await writeFile(target, Buffer.from(file.content, 'base64'));
    }));
    console.log('Downloaded ' + Math.min(index + 4, paths.length) + '/' + paths.length);
  }
  const chapters = await Promise.all(paths.filter(path => path.startsWith('book/')).map(async path => ({
    path,
    text: await readFile(join(staging, 'source', path), 'utf8'),
  })));
  const library = parseLibrary(chapters, {
    repo: 'https://github.com/' + repo, commit: sha,
    sourceUpdatedAt: commit.commit.committer.date,
    syncedOn: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date()),
  });
  if (library.categories.length < 34 || library.entries.length < 772) {
    throw new Error('Incomplete library: ' + library.categories.length + ' chapters, ' + library.entries.length + ' entries');
  }
  await writeFile(join(staging, 'library.json'), JSON.stringify(library));
  // The published snapshot only changes after every file has downloaded and parsed.
  await mkdir(root, { recursive: true });
  await rm(join(root, 'source'), { recursive: true, force: true });
  await rename(join(staging, 'source'), join(root, 'source'));
  await writeFile(join(root, 'library.json'), JSON.stringify(library));
  console.log('Imported ' + library.entries.length + ' entries in ' + library.categories.length + ' categories at ' + sha);
} finally {
  await rm(staging, { recursive: true, force: true });
}
