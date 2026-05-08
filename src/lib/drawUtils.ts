/**
 * Calendar drawing utility
 */
import { Theme, WallpaperSettings, DEVICES } from '../types';

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// Mock simple production calendar (holidays) - for production, this could be a larger static file or API
const HOLIDAYS_2026 = [
  '2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08',
  '2026-02-23', '2026-03-08', '2026-05-01', '2026-05-09', '2026-06-12', '2026-11-04'
];

function isHoliday(date: Date, mode: string) {
  const dateStr = date.toISOString().split('T')[0];
  const dayOfWeek = date.getDay();
  
  if (mode === 'none') return false;
  
  const isWknd = dayOfWeek === 0 || dayOfWeek === 6;
  if (mode === 'weekends_only') return isWknd;
  
  if (mode === 'production_calendar') {
    return isWknd || HOLIDAYS_2026.includes(dateStr);
  }
  
  return false;
}

export function drawWallpaper(
  ctx: CanvasRenderingContext2D,
  settings: WallpaperSettings,
  theme: Theme,
  canvasWidth: number,
  canvasHeight: number
) {
  const width = canvasWidth;
  const height = canvasHeight;
  
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, width, height);

  if (settings.opacity > 0) {
    ctx.fillStyle = `rgba(0,0,0,${settings.opacity / 100})`;
    ctx.fillRect(0, 0, width, height);
  }

  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const localDate = new Date(utc + (3600000 * settings.timezone));
  
  const currentYear = localDate.getFullYear();
  const currentMonth = localDate.getMonth();
  const currentDay = localDate.getDate();

  const isLarge = settings.calendar_size.startsWith('large');
  const padding = width * 0.08;
  const usableWidth = width - padding * 2;
  
  let startY = height * 0.30;
  if (settings.calendar_size === 'large_no_top') startY = height * 0.15;
  else if (settings.calendar_size === 'large_no_bottom') startY = height * 0.45;
  else if (settings.calendar_size === 'standard') startY = height * 0.4;
  
  const headerFontSize = isLarge ? width * 0.08 : width * 0.06;
  const yearFontSize = isLarge ? width * 0.05 : width * 0.04;
  
  const rMonthNamesFull = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'];
  const eMonthNamesFull = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  
  const rMonthNamesShort = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const eMonthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 1. Title (Year)
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.text;
  ctx.font = `800 ${headerFontSize}px system-ui, -apple-system, sans-serif`;
  
  const displayTitle = settings.style === 'numbers_current_month' 
    ? (settings.lang === 'ru' ? rMonthNamesFull[currentMonth] : eMonthNamesFull[currentMonth])
    : currentYear.toString();

  ctx.fillText(displayTitle, padding, startY - headerFontSize * 0.7);

  // 2. Logic for Full Year/Single Month
  if (settings.style === 'numbers_current_month') {
    // SINGLE MONTH VIEW (NUMBERS) - TITLE IS ALREADY SET AS MONTH NAME
    const firstDay = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;
    
    const cellW = usableWidth / 7;
    const cellH = isLarge ? cellW * 1.1 : cellW;
    
    const dayHeaders = settings.lang === 'ru' ? ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'] : ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    ctx.font = `600 ${cellW * 0.25}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    
    dayHeaders.forEach((h, i) => {
      ctx.fillStyle = theme.muted;
      ctx.fillText(h, padding + (i * cellW) + (cellW / 2), startY + cellH * 0.8);
    });
    
    let d = 1;
    let gridTop = startY + cellH;
    
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const idx = row * 7 + col;
        if (idx >= startDayOfWeek && d <= daysInMonth) {
          const x = padding + (col * cellW) + (cellW / 2);
          const y = gridTop + (row * cellH) + (cellH / 2);
          
          const isToday = (d === currentDay);
          const isPast = (d < currentDay);
          const drawDate = new Date(currentYear, currentMonth, d);
          const isHoli = isHoliday(drawDate, settings.weekend_mode);
          
          let color = theme.number;
          if (isPast) color = theme.past;
          if (isToday) color = theme.today;
          else if (isHoli) color = theme.accent || theme.today;
          
          const size = cellW * 0.8;
          ctx.fillStyle = color;
          ctx.font = `600 ${size}px system-ui, -apple-system, sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.fillText(d.toString(), x, y);
          d++;
        }
      }
    }
  } else if (settings.style === 'dots_15_progress') {
    // SPECIAL STYLE: DOTS 15 PROGRESS (YEAR PROGRESS)
    const cols = 15;
    const daysInYear = ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) ? 366 : 365;
    
    const startOfYear = new Date(currentYear, 0, 1).getTime();
    const elapsedMs = localDate.getTime() - startOfYear;
    const daysPassed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    
    const dotW = usableWidth / cols;
    const dotH = dotW * 0.85;
    const yOffset = startY + headerFontSize * 0.3;
    const radius = dotW * 0.18;

    for (let p = 0; p < daysInYear; p++) {
      const col = p % cols;
      const row = Math.floor(p / cols);
      const x = padding + (col + 0.5) * dotW;
      const y = yOffset + (row + 0.5) * dotH;

      const pDate = new Date(currentYear, 0, p + 1);
      const isHolid = isHoliday(pDate, settings.weekend_mode);

      let dotColor = theme.future;
      if (p < daysPassed) dotColor = theme.past;
      if (p === daysPassed) dotColor = theme.today;
      else if (isHolid) dotColor = theme.accent || theme.today;

      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // 12 MONTH GRID FOR ALL OTHER STYLES
    const monthCols = 3;
    const monthGapX = usableWidth * 0.08;
    const monthGapY = height * 0.03; // Reduced gap to fit everything
    const monthWidth = (usableWidth - (monthGapX * (monthCols - 1))) / monthCols;
    
    // Tighten the grid to ensure it doesn't overlap footer
    const gridCellH = (monthWidth / 7) * 0.75; // Slightly tighter vertical spacing
    
    for (let m = 0; m < 12; m++) {
      const mCol = m % monthCols;
      const mRow = Math.floor(m / monthCols);
      
      const mX = padding + mCol * (monthWidth + monthGapX);
      const mY = startY + mRow * (monthWidth * 0.9 + monthGapY); // Adjusted row spacing
      
      // Month Name
      ctx.textAlign = 'left';
      ctx.fillStyle = theme.text;
      ctx.font = `700 ${width * 0.032}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(settings.lang === 'ru' ? rMonthNamesShort[m].toUpperCase() : eMonthNamesShort[m].toUpperCase(), mX, mY);
      
      const firstDay = new Date(currentYear, m, 1);
      const daysInMonth = new Date(currentYear, m + 1, 0).getDate();
      let startDayOfWeek = firstDay.getDay() - 1;
      if (startDayOfWeek === -1) startDayOfWeek = 6;
      
      const gridStartY = mY + width * 0.025;
      const cellW = monthWidth / 7;
      const cellH = gridCellH;
      
      let d = 1;
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
          const idx = row * 7 + col;
          if (idx >= startDayOfWeek && d <= daysInMonth) {
            const x = mX + (col * cellW) + cellW/2;
            const y = gridStartY + (row * cellH) + cellH/2;
            
            const isToday = (m === currentMonth && d === currentDay);
            const isPast = (m < currentMonth) || (m === currentMonth && d < currentDay);
            const checkDate = new Date(currentYear, m, d);
            const isHolid = isHoliday(checkDate, settings.weekend_mode);
            
            let color = theme.future;
            if (isPast) color = theme.past;
            if (isToday) color = theme.today;
            else if (isHolid) color = theme.accent || theme.today;

            ctx.fillStyle = color;

            if (settings.style === 'dots') {
              ctx.beginPath(); ctx.arc(x, y, cellW * 0.22, 0, Math.PI * 2); ctx.fill();
            } else if (settings.style === 'squares') {
              const s = cellW * 0.45; ctx.fillRect(x - s/2, y - s/2, s, s);
            } else if (settings.style === 'bars') {
              const bw = cellW * 0.7; const bh = cellW * 0.15; ctx.fillRect(x - bw/2, y - bh/2, bw, bh);
            } else if (settings.style === 'rings') {
              ctx.strokeStyle = color; ctx.lineWidth = 1.2;
              ctx.beginPath(); ctx.arc(x, y, cellW * 0.18, 0, Math.PI * 2); ctx.stroke();
              if (isToday) { ctx.beginPath(); ctx.arc(x, y, cellW * 0.08, 0, Math.PI * 2); ctx.fill(); }
            } else if (settings.style === 'numbers') {
              ctx.font = `600 ${cellW * 0.4}px system-ui, -apple-system, sans-serif`;
              ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(d.toString(), x, y);
            }
            d++;
          }
        }
        if (d > daysInMonth) break;
      }
    }
  }

  if (settings.footer !== 'none') {
    const year = currentYear;
    const startOfYear = new Date(year, 0, 1).getTime();
    const endOfYear = new Date(year + 1, 0, 1).getTime();
    const totalMs = endOfYear - startOfYear;
    const elapsedMs = localDate.getTime() - startOfYear;
    const progressPercent = (elapsedMs / totalMs) * 100;
    
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const daysPassed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    const daysLeft = totalDays - daysPassed;

    let footerText = '';
    
    if (settings.footer === 'days_left') {
      footerText = settings.lang === 'ru' ? `ОСТАЛОСЬ ${daysLeft} ДНЕЙ` : `${daysLeft} DAYS LEFT`;
    } else if (settings.footer === 'days_left_percent_left') {
      footerText = settings.lang === 'ru' ? `ОСТАЛОСЬ ${daysLeft} ДНЕЙ • ${Math.max(0, 100 - progressPercent).toFixed(1)}%` : `${daysLeft} DAYS LEFT • ${Math.max(0, 100 - progressPercent).toFixed(1)}%`;
    } else if (settings.footer === 'days_left_percent_done') {
      footerText = settings.lang === 'ru' ? `ОСТАЛОСЬ ${daysLeft} ДНЕЙ • ГОД ПРОШЕЛ НА ${progressPercent.toFixed(1)}%` : `${daysLeft} DAYS LEFT • ${progressPercent.toFixed(1)}% DONE`;
    } else if (settings.footer === 'quote') {
      footerText = settings.lang === 'ru' ? 'СДЕЛАЙ ЧТО-НИБУДЬ СЕГОДНЯ' : 'DO SOMETHING TODAY';
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = theme.muted;
    ctx.font = `500 ${width * 0.035}px system-ui, -apple-system, sans-serif`;
    
    const footerY = height * 0.85; // Higher position for iPhone compatibility
    ctx.fillText(footerText, width / 2, footerY);

    if (settings.footer !== 'quote') {
      const barW = width * 0.6;
      const barH = width * 0.008;
      const barX = (width - barW) / 2;
      const barY = footerY + width * 0.04;

      ctx.fillStyle = theme.dot;
      drawRoundedRect(ctx, barX, barY, barW, barH, barH/2);
      ctx.fill();

      ctx.fillStyle = theme.today;
      drawRoundedRect(ctx, barX, barY, barW * (progressPercent / 100), barH, barH/2);
      ctx.fill();
    }
  }
}
