import { mkdir, writeFile } from 'node:fs/promises'
import { heroSources } from '../src/heroes.js'

await mkdir(new URL('../public/heroes/', import.meta.url), { recursive: true })

for (const hero of heroSources) {
  const response = await fetch(hero.source, {
    headers: { Accept: 'image/webp' },
    signal: AbortSignal.timeout(30000)
  })
  if (!response.ok || response.headers.get('content-type') !== 'image/webp') {
    throw new Error(`${hero.name}: unexpected response ${response.status} ${response.headers.get('content-type')}`)
  }
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP' || bytes.length < 1000) {
    throw new Error(`${hero.name}: invalid image data`)
  }
  await writeFile(new URL(`../public/${hero.image}`, import.meta.url), bytes)
  console.log(`${hero.name}: ${(bytes.length / 1024).toFixed(1)} KB`)
}
