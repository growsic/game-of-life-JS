# Game of Life

This is a React + TypeScript implementation of Conway's Game of Life built with [Vite](https://vitejs.dev/).

## Rules
- Any live cell with fewer than two live neighbours dies, as if caused by under-population.
- Any live cell with two or three live neighbours lives on to the next generation.
- Any live cell with more than three live neighbours dies, as if by overcrowding.
- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

## Development
1. Install dependencies
   ```bash
   npm install
   ```
2. Start the dev server
   ```bash
   npm run dev
   ```

## Building
Create a production build with:
```bash
npm run build
```

## GitHub Pages Deployment
This project uses the `gh-pages` package for deployment.
Run the following to build the project and push the `dist` folder to the `gh-pages` branch:
```bash
npm run deploy
```
After deploying, the site will be available at `https://<username>.github.io/game-of-life-JS/`.

