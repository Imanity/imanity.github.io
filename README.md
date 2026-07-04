# Imanity Homepage

React + TypeScript + Vite personal homepage for GitHub Pages.

## Structure

- `src/pages` contains the homepage, projects, photos, about, and 404 pages.
- `src/content` contains site-owned content, including future photo metadata.
- `@imanity/tabi-gallery` is consumed as a reusable gallery library from `../tabi-gallery` during local development.

## Local Development

Install Node.js first, then run:

```powershell
cd D:\Projects\tabi-gallery
npm install

cd D:\Projects\imanity.github.io
npm install
npm run dev
```

## Build

```powershell
cd D:\Projects\tabi-gallery
npm run build

cd D:\Projects\imanity.github.io
npm run build
```

## Image Tools

Image tooling is implemented in `../tabi-gallery/tools` and exposed here through npm scripts.

Convert a directory of images to JPEG, resize each image so its longest side is no larger than 1920px, and write `src/content/photos.ts`:

```powershell
npm run tools:images -- --input D:\Photos\raw --output .\public\assets\photos
```

Common options:

```powershell
npm run tools:images -- --input ./photos/raw --output ./public/assets/photos --config ./src/content/photos.ts
npm run tools:images -- --input ./photos/raw --output ./public/assets/photos --size 1920 --quality 88
npm run tools:images -- --input ./photos/raw --output ./public/assets/photos --name-format "{name}"
npm run tools:images -- --input ./photos/raw --output ./public/assets/photos --name-format "{dir}/{index}-{name}"
npm run tools:images -- --input ./photos/raw --output ./public/assets/photos --no-recursive
npm run tools:images -- --input ./photos/raw --output ./public/assets/photos --dry-run
```

By default, exported files are named `00001.jpg`, `00002.jpg`, and so on. `--name-format` supports `{index}`, `{name}`, and `{dir}` tokens. The generated `photos.ts` uses asset paths relative to the public root, such as `assets/photos/00001.jpg`.

Launch the local visual manager:

```powershell
npm run tools:gallery -- --open
```

The manager can choose input/output/config paths, export images, and edit `photos.ts` with autosave.

## Git LFS

Common binary image and video formats are configured for Git LFS through `.gitattributes`. SVG files remain in regular Git so they can be reviewed as text.

After cloning this repository on a new machine, run:

```powershell
git lfs install
git lfs pull
```

## Photo Library Dependency

The site currently uses:

```json
"@imanity/tabi-gallery": "file:../tabi-gallery"
```

After the library is published to npm, replace it with a normal semver version such as:

```json
"@imanity/tabi-gallery": "^0.1.0"
```
