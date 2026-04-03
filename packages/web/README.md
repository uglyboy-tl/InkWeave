# @inkweave/web

Pre-built browser bundle for InkWeave - ready to use via CDN or script tag without any build tools.

## Quick Start via CDN

### unpkg

```html
<link rel="stylesheet" href="https://unpkg.com/@inkweave/web/dist/inkweave.min.css">
<script src="https://unpkg.com/@inkweave/web"></script>
```

### jsDelivr

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@inkweave/web/dist/inkweave.min.css">
<script src="https://cdn.jsdelivr.net/npm/@inkweave/web"></script>
```

## Usage

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@inkweave/web/dist/inkweave.min.css">
</head>
<body>
  <div id="story-container"></div>
  
  <script src="https://unpkg.com/@inkweave/web"></script>
  <script>
    InkWeave.init({
      container: '#story-container',
      story: `
        Hello, World!
        + [Choice A] You chose A. -> DONE
        + [Choice B] You chose B. -> DONE
      `,
      title: 'My Story',
      basePath: './stories/'  // Optional: for loading external .ink files
    });
  </script>
</body>
</html>
```

## API

### `InkWeave.init(options)`

Initialize InkWeave in your container.

**Options:**
- `container` (string | Element): CSS selector or DOM element
- `story` (string): Ink story content (inline or from file)
- `title` (string): Story title
- `basePath` (string): Base path for loading external files
- `theme` ('light' | 'dark'): Theme mode

### `InkWeave.version`

Current version string.

## Bundle Contents

This bundle includes everything you need:
- React & ReactDOM
- inkjs runtime
- InkWeave core engine
- Built-in plugins (image, audio, fade, etc.)
- CSS styles

**Bundle size:** ~138KB (gzip)

## For Build Tool Users

If you're using webpack, Vite, or other build tools, consider using the modular packages instead:
- `@inkweave/core` - Core engine
- `@inkweave/react` - React components  
- `@inkweave/plugins` - Optional plugins

This allows for better optimization and smaller bundles.

## License

MIT