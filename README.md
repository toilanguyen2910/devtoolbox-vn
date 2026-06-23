# DevToolboxVN 🧰

A minimalist web toolbox for Vietnamese developers. Free, fast, no account needed.

## Tools

- **JSON Formatter** — Format, validate, and prettify JSON with syntax highlighting
- **Base64 Converter** — Encode/decode text and files to/from Base64
- More tools coming soon!

## Features

- 🚀 Pure HTML/CSS/JavaScript — no dependencies
- 📱 Mobile-friendly responsive design
- 🎨 Clean, minimalist UI inspired by Excalidraw
- 💾 Copy-to-clipboard for all outputs
- 🌐 Works offline (after first load)

## Getting Started

### Local Development

1. Clone the repo:
```bash
git clone https://github.com/yourusername/devtoolbox-vn.git
cd devtoolbox-vn
```

2. Open `index.html` in your browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

3. Navigate to different tools using the menu

### Deployment

This project is deployed to GitHub Pages. To deploy your fork:

1. Push to your `main` branch
2. Go to repo Settings → Pages
3. Select "Deploy from a branch" → `main` branch
4. Your site will be live at `https://yourusername.github.io/devtoolbox-vn`

## Project Structure

```
devtoolbox-vn/
├── index.html              # Landing page
├── README.md               # This file
├── css/
│   ├── main.css           # Global styles
│   └── tools.css          # Tool-specific styles
├── js/
│   ├── main.js            # Navigation & routing
│   └── tools/
│       ├── json-formatter.js
│       └── base64-converter.js
└── tools/
    ├── json-formatter.html
    └── base64-converter.html
```

## Adding New Tools

1. Create `tools/your-tool.html` with tool UI
2. Create `js/tools/your-tool.js` with logic
3. Add link in `index.html`
4. Add styles in `css/tools.css`

Each tool is independent — no shared state between tools.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT — free to use and modify

## Made with everyone

Created by Jack Nguyen

Share your tools and feedback on [Facebook](https://facebook.com/groups/laptrinhvien)
