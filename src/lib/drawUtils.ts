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

function isWeekend(date: Date, mode: string) {
  const dayOfWeek = date.getDay();
  if (mode === 'none') return false;
  if (mode === 'weekends_only' || mode === 'production_calendar') {
    return dayOfWeek === 0 || dayOfWeek === 6;
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
  
  const year = localDate.getFullYear();
  const month = localDate.getMonth();
  const day = localDate.getDate();

  const isLarge = settings.calendar_size.startsWith('large');
  const padding = width * 0.08;
  const usableWidth = width - padding * 2;
  
  let startY = height * 0.28;
  if (settings.calendar_size === 'large_no_top') startY = height * 0.15;
  else if (settings.calendar_size === 'large_no_bottom') startY = height * 0.45;
  else if (settings.calendar_size === 'standard') startY = height * 0.4;
  
  const headerFontSize = isLarge ? width * 0.08 : width * 0.06;
  const yearFontSize = isLarge ? width * 0.05 : width * 0.04;
  
  const rMonths = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'];
  const eMonths = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const monthStr = settings.lang === 'ru' ? rMonths[month] : eMonths[month];
  
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.text;
  ctx.font = `800 ${headerFontSize}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(monthStr, padding, startY - headerFontSize * 0.7);
  
  ctx.font = `600 ${yearFontSize}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = theme.muted;
  ctx.fillText(year.toString(), padding, startY - headerFontSize * 0.7 + yearFontSize * 1.5);

  if (settings.style === 'dots_15_progress') {
    const cols = 15;
    const daysInYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
    
    const startOfYear = new Date(year, 0, 1).getTime();
    const elapsedMs = localDate.getTime() - startOfYear;
    const daysPassed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    
    const dotW = usableWidth / cols;
    const dotH = dotW;
    const yOffset = startY + headerFontSize;
    const radius = dotW * 0.25;

    for (let p = 0; p < daysInYear; p++) {
      const col = p % cols;
      const row = Math.floor(p / cols);
      const x = padding + (col + 0.5) * dotW;
      const y = yOffset + (row + 0.5) * dotH;

      let dotColor = theme.future;
      if (p < daysPassed) dotColor = theme.past;
      if (p === daysPassed) dotColor = theme.today;

      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
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
    let gridOffset = startY + cellH;
    
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const idx = row * 7 + col;
        if (idx >= startDayOfWeek && d <= daysInMonth) {
          const x = padding + (col * cellW) + (cellW / 2);
          const y = gridOffset + (row * cellH) + (cellH / 2);
          
          const isToday = (d === day);
          const isPast = (d < day);
          const drawDate = new Date(year, month, d);
          const isWknd = isWeekend(drawDate, settings.weekend_mode);
          
          let color = theme.future;
          if (isPast) color = theme.past;
          if (isToday) color = theme.today;
          
          const size = cellW * 0.6;
          
          if (settings.style === 'dots') {
            ctx.fillStyle = color;
            ctx.beginPath();ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);ctx.fill();
          } else if (settings.style === 'squares') {
            ctx.fillStyle = color;
            const s = size * 0.9;
            drawRoundedRect(ctx, x - s/2, y - s/2, s, s, s*0.2);ctx.fill();
          } else if (settings.style === 'bars') {
            ctx.fillStyle = color;
            const barW = size * 1.5; const barH = size * 0.3;
            drawRoundedRect(ctx, x - barW/2, y - barH/2, barW, barH, barH/2);ctx.fill();
          } else if (settings.style === 'rings') {
            const r = size * 0.5;
            ctx.strokeStyle = color; ctx.lineWidth = size * 0.15;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
            if (isToday) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0, Math.PI * 2); ctx.fill(); }
          } else if (settings.style === 'numbers' || settings.style === 'numbers_current_month') {
             ctx.fillStyle = isToday ? theme.today : (isPast ? theme.past : theme.number);
             if (!isToday && isWknd && settings.weekend_mode !== 'none') {
               ctx.fillStyle = theme.today;
             }
             ctx.font = `600 ${size * 0.8}px system-ui, -apple-system, sans-serif`;
             ctx.textBaseline = 'middle';
             ctx.fillText(d.toString(), x, y);
          }
          d++;
        }
      }
    }
  }

  if (settings.footer !== 'none') {
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
    
    const footerY = height * 0.8;
    ctx.fillText(footerText, width / 2, footerY);

    if (settings.footer !== 'quote') {
      const barW = width * 0.6;
      const barH = width * 0.01;
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
