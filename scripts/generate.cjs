const puppeteer = require('puppeteer');
const path = require('path');

// =========================================================================
// НАСТРОЙКИ ДЛЯ ГЕНЕРАЦИИ ОБОЕВ (Настрой под себя!)
// Подсматривай названия в браузере (в строке URL) при выборе настроек
// =========================================================================
const SETTINGS = {
  model: 'iphone_15_pro', 
  style: 'dots',
  calendar_size: 'standard',
  weekend_mode: 'weekends_only',
  opacity: 0,
  theme: 'forest_green',
  lang: 'ru',
  timezone: 3,
  footer: 'days_left_percent_left'
};

const width = 1179; // Ширина твоего телефона (Напр. iPhone 15 Pro)
const height = 2556; // Высота твоего телефона

(async () => {
  console.log('Запуск браузера для рендера обоев...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  
  // Собираем параметры в URL. На локальном сервере сайт запускается на 3000 порту
  const params = new URLSearchParams({ auto: 'true', ...SETTINGS });
  const url = `http://localhost:3000/?${params.toString()}`;
  
  console.log('Переходим по адресу:', url);
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  // Даем чуть-чуть времени, чтобы canvas гарантированно отрисовался
  await new Promise(r => setTimeout(r, 1000));
  
  const outputPath = path.join(__dirname, '../dist/wallpaper.png');
  await page.screenshot({ path: outputPath });
  
  console.log('✅ Обои успешно сгенерированы и сохранены:', outputPath);
  await browser.close();
})();
