import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=resolve(new URL('..', import.meta.url).pathname);
const out=resolve(root,'www');
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for (const name of ['index.html','js','style','assets']) await cp(resolve(root,name),resolve(out,name),{recursive:true});
console.log(`Synced web files to ${out}`);
