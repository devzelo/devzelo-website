(async () => {
  const fs = require('fs');
  const path = require('path');
  const { minify } = require('html-minifier-terser');
  const csso = require('csso');
  const rimraf = require('rimraf');

  const srcDir = __dirname;
  const outDir = path.join(srcDir, 'dist');

  // Clean previous output
  rimraf.sync(outDir);
  fs.mkdirSync(outDir, { recursive: true });

  // Recursively copy files/folders
  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest);
      for (const entry of fs.readdirSync(src)) {
        copyRecursive(path.join(src, entry), path.join(dest, entry));
      }
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  // Copy assets folder if present
  const assetsPath = path.join(srcDir, 'assets');
  if (fs.existsSync(assetsPath)) {
    copyRecursive(assetsPath, path.join(outDir, 'assets'));
  }

  // Process HTML files – async minify returns Promise
  const htmlFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const srcPath = path.join(srcDir, file);
    const html = fs.readFileSync(srcPath, 'utf-8');
    const minified = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
      minifyCSS: true,
      useShortDoctype: true,
    });
    fs.writeFileSync(path.join(outDir, file), minified, 'utf-8');
    console.log(`HTML → ${file}`);
  }

  // Minify CSS (style.css)
  const cssPath = path.join(srcDir, 'style.css');
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf-8');
    const minCss = csso.minify(css).css;
    fs.writeFileSync(path.join(outDir, 'style.css'), minCss, 'utf-8');
    console.log('CSS → style.css');
  }

  console.log('✅ Build completed. Output in /dist');
})();
