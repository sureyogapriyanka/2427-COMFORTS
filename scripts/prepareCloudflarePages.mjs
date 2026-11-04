import { mkdir, readdir, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDirectory = resolve('dist');
const siteDirectory = resolve(outputDirectory, '2427-COMFORTS');
const entries = await readdir(outputDirectory);

if (entries.includes('2427-COMFORTS')) {
  throw new Error('Cloudflare Pages output already contains a 2427-COMFORTS directory.');
}

await mkdir(siteDirectory);
for (const entry of entries) {
  await rename(resolve(outputDirectory, entry), resolve(siteDirectory, entry));
}

await writeFile(
  resolve(outputDirectory, '_redirects'),
  [
    '/ /2427-COMFORTS/ 301',
    '/2427-COMFORTS /2427-COMFORTS/ 301',
    '',
  ].join('\n'),
  'utf8'
);

await writeFile(
  resolve(outputDirectory, '_routes.json'),
  `${JSON.stringify({
    version: 1,
    include: ['/2427-COMFORTS/api', '/2427-COMFORTS/api/*'],
    exclude: [],
  }, null, 2)}\n`,
  'utf8'
);
