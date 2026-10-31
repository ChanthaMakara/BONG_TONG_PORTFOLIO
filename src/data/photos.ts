/// <reference types="vite/client" />

// Loads every image in src/assets/photos/<group-folder>/ automatically.
const files = import.meta.glob(
  '../assets/photos/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

export type Photo = { src: string; alt: string };
export type PhotoGroup = {
  id: string;
  title: string;
  description?: string;
  photos: Photo[];
};

/** Optional: nicer titles & descriptions */
const overrides: Record<string, { title?: string; description?: string }> = {
  '01-first-series': {
    title: 'First Series',
    description: 'Studio portraits & stills',
  },
  '02-second-series': {                          
    title: 'Second Series',                      
    description: 'Write a short story here',     
  },
  '03-third-series': {                        
    title: 'Third Series',                    
    description: 'Write a short description', 
  },
    '04-fourth-series': {                        
    title: 'Fourth Series',                    
    description: 'Write a short description', 
  },
  '05-fifth-series': {
    title: 'Fifth Series',
    description: 'Your description here',
  },
  '06-sixth-series': {
    title: 'Sixth Series',
    description: 'Your description here',
  },
  '07-seventh-series': {
    title: 'Seventh Series',
    description: 'Your description here',
  },
};

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const prettify = (folder: string) =>
  folder
    .replace(/^\d+[-_ ]*/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const byFolder = new Map<string, { path: string; src: string }[]>();
for (const [path, src] of Object.entries(files)) {
  const parts = path.split('/');
  const folder = parts[parts.length - 2];
  if (!byFolder.has(folder)) byFolder.set(folder, []);
  byFolder.get(folder)!.push({ path, src });
}

export const photoGroups: PhotoGroup[] = [...byFolder.entries()]
  .sort(([a], [b]) => collator.compare(a, b))
  .map(([folder, list]) => {
    const title = overrides[folder]?.title ?? prettify(folder);
    return {
      id: folder,
      title,
      description: overrides[folder]?.description,
      photos: list
        .sort((a, b) => collator.compare(a.path, b.path))
        .map((f, i) => ({ src: f.src, alt: `${title}, photo ${i + 1}` })),
    };
  });

export const totalPhotos = photoGroups.reduce((n, g) => n + g.photos.length, 0);