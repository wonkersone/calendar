import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { THEMES } from "./src/types";

// Setup for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The drawing function from our frontend code
// We'll import it slightly differently or duplicate some logic if needed
import { drawWallpaper } from "./src/lib/drawUtils";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Endpoint to generate the wallpaper image
  // Example usage: /api/wallpaper?theme=midnight_blue&style=numbers_current_month&opacity=0&width=1170&height=2532
  app.get("/api/wallpaper", async (req, res) => {
    try {
      const {
        theme = 'graphite_orange',
        style = 'numbers_current_month',
        calendar_size = 'standard',
        weekend_mode = 'weekends_only',
        footer = 'days_left',
        opacity = '0',
        width = '1170',
        height = '2532',
        timezone = '0', // Offset in hours relative to GMT
        lang = 'ru'
      } = req.query as Record<string, string>;

      const w = parseInt(width, 10) || 1170;
      const h = parseInt(height, 10) || 2532;
      
      const themeConfig = THEMES[theme] || THEMES.graphite_orange;
      
      // Parse settings
      const settings = {
        theme: theme as any,
        style: style as any,
        calendar_size: calendar_size as any,
        weekend_mode: weekend_mode as any,
        footer: footer as any,
        opacity: parseInt(opacity, 10) || 0,
        timezone: parseFloat(timezone) || 0,
        lang: lang as any
      };

      // Create a canvas with @napi-rs/canvas
      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      // Call the same drawing utility that runs on the frontend
      // Important: @napi-rs/canvas context is not perfectly matching DOM typings, but close enough
      drawWallpaper(ctx as any, settings, themeConfig, w, h);

      // Return PNG
      res.setHeader('Content-Type', 'image/png');
      const pngData = await canvas.encode('png');
      res.send(pngData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error generating image");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
