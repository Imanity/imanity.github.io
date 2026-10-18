# Imanity Homepage

React + TypeScript + Vite personal homepage for GitHub Pages.

## Documentation

- [Technical overview](docs/technical.md)
- [Project progress](docs/progress.md)
- [Google Maps API setup](docs/google-maps.md)

## Structure

- `src/pages` contains the homepage, projects, photos, about, and 404 pages.
- `src/content` contains profile and project content.
- `src/gallery` loads and validates the public gallery JSON files.
- `public/data/galleries` contains the gallery manifest and separate configs.
- `public/data/gallery-taxonomy.json` contains localized tag and country names.
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

Create a gallery JSON, convert a directory of images to JPEG, and register the gallery in the public manifest:

```powershell
npm run tools:images -- --input D:\Photos\raw --output .\public\assets\photos\travel --config .\public\data\galleries\travel.json --gallery travel --title "Travel"
```

Common options:

```powershell
npm run tools:images -- --input ./photos/more --output ./public/assets/photos/travel --config ./public/data/galleries/travel.json
npm run tools:images -- --input ./photos/raw --output ./public/assets/photos/travel --config ./public/data/galleries/travel.json --size 1920 --quality 88
npm run tools:images -- --input ./photos/raw --output ./public/assets/photos/travel --config ./public/data/galleries/travel.json --name-format "{name}"
npm run tools:images -- --input ./photos/raw --output ./public/assets/photos/travel --config ./public/data/galleries/travel.json --dry-run
```

The default `append` mode preserves existing metadata, continues sequence numbers, and skips content already present in the same gallery. Use `--mode replace` only when the config should be rebuilt. Gallery configs live in `public/data/galleries/*.json`; `index.json` tells the site which configs to load.

Photo configs store stable tag and country IDs. Their `zh-CN`, `en`, `ja`, and
future translations are maintained in `public/data/gallery-taxonomy.json`. The visual
manager provides vocabulary editing, tag checkboxes, and a country selector.
The selected country is synchronized into `tags` automatically.

Launch the local visual manager:

```powershell
npm run tools:gallery -- --open
```

The manager can create and switch galleries, import additional batches, preview images, and edit JSON metadata with autosave.

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
