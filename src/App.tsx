/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { THEMES, WallpaperSettings, DEVICES } from './types';
import { drawWallpaper } from './lib/drawUtils';

export default function App() {
  const [settings, setSettings] = useState<WallpaperSettings>({
    model: 'iphone_15_pro',
    style: 'dots',
    calendar_size: 'standard',
    weekend_mode: 'weekends_only',
    opacity: 0,
    theme: 'graphite_orange',
    lang: 'ru',
    timezone: 3,
    footer: 'days_left_percent_left',
  });

  const [isAutoMode, setIsAutoMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('model') || params.has('auto')) {
      const newSettings: Partial<WallpaperSettings> = {};
      if (params.has('model')) newSettings.model = params.get('model') as any;
      if (params.has('theme')) newSettings.theme = params.get('theme') as any;
      if (params.has('lang')) newSettings.lang = params.get('lang') as any;
      if (params.has('style')) newSettings.style = params.get('style') as any;
      if (params.has('calendar_size')) newSettings.calendar_size = params.get('calendar_size') as any;
      if (params.has('weekend_mode')) newSettings.weekend_mode = params.get('weekend_mode') as any;
      if (params.has('footer')) newSettings.footer = params.get('footer') as any;
      if (params.has('timezone')) newSettings.timezone = parseInt(params.get('timezone') || '3');
      if (params.has('opacity')) newSettings.opacity = parseInt(params.get('opacity') || '0');
      
      setSettings(prev => ({ ...prev, ...newSettings }));
      if (params.get('auto') === 'true' || params.get('auto') === '1') {
        setIsAutoMode(true);
      }
    }
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      const theme = THEMES[settings.theme] || THEMES.graphite_orange;
      const device = DEVICES[settings.model] || DEVICES.iphone_15_pro;
      ctx.clearRect(0, 0, device.width, device.height);
      drawWallpaper(ctx, settings, theme, device.width, device.height);
    }
  }, [settings]);

  useEffect(() => {
    if (isAutoMode && canvasRef.current) {
      setTimeout(() => {
        downloadImage();
      }, 500);
    }
  }, [isAutoMode, settings]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `wallpaper-${settings.model}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const getAutomationUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('auto', 'true');
    params.set('model', settings.model);
    params.set('style', settings.style);
    params.set('calendar_size', settings.calendar_size);
    params.set('weekend_mode', settings.weekend_mode);
    params.set('opacity', settings.opacity.toString());
    params.set('theme', settings.theme);
    params.set('lang', settings.lang);
    params.set('timezone', settings.timezone.toString());
    params.set('footer', settings.footer);
    return `${baseUrl}?${params.toString()}`;
  };

  const copyUrl = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(getAutomationUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isAutoMode) {
    const device = DEVICES[settings.model] || DEVICES.iphone_15_pro;
    return (
      <div className="min-h-[100vh] bg-black flex items-center justify-center m-0 p-0 overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={device.width} 
          height={device.height} 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const device = DEVICES[settings.model] || DEVICES.iphone_15_pro;

  return (
    <div className="min-h-screen font-sans text-[#f3f4f6]" style={{
      background: 'radial-gradient(1200px 700px at 25% -10%, rgba(124,92,255,.20), transparent 60%), radial-gradient(900px 600px at 80% 10%, rgba(255,122,47,.14), transparent 55%), linear-gradient(180deg, #05070b 0%, #07090d 60%, #06070a 100%)'
    }}>
      <div className="max-w-[1080px] mx-auto px-[18px] pt-[22px] pb-[72px]">
        <div className="flex items-center justify-between py-[10px] pb-[18px] text-[rgba(243,244,246,.52)] text-[13px]">
          <div className="flex gap-[10px] items-center">
            <span className="w-[10px] h-[10px] rounded-full bg-gradient-to-br from-[#7c5cff] to-[#ff7a2f] shadow-[0_0_18px_rgba(124,92,255,.35)]"></span>
            <span>Сергей Алейников · Трендовый календарь</span>
          </div>
          <div className="text-[12px] hidden md:block">Ежедневное обновление · Обои на iPhone</div>
        </div>

        <section className="pt-[58px] pb-[24px] px-[4px] grid gap-[18px]">
          <h1 className="m-0 text-[clamp(34px,4.4vw,62px)] leading-[1.02] tracking-[-.02em]">
            Календарь — не профакай год.
          </h1>
          <p className="m-0 max-w-[720px] text-[rgba(243,244,246,.68)] text-[16px] leading-[1.5]">
            Обои-календарь, которые обновляются автоматически и показывают прогресс года.
          </p>
          <div className="flex gap-[10px] flex-wrap mt-[8px]">
            <a href="#generator" className="inline-flex items-center gap-[10px] px-[14px] py-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-gradient-to-b from-[rgba(255,255,255,.06)] to-[rgba(255,255,255,.03)] shadow-[0_10px_30px_rgba(0,0,0,.25)] cursor-pointer select-none no-underline font-semibold text-[#f3f4f6] hover:brightness-110 transition-all">
              Сгенерировать ссылку
            </a>
            <button onClick={downloadImage} className="inline-flex items-center gap-[10px] px-[14px] py-[12px] rounded-[14px] border border-[rgba(255,255,255,.08)] bg-transparent text-[rgba(243,244,246,.68)] cursor-pointer select-none no-underline font-semibold hover:brightness-110 transition-all">
              Скачать PNG
            </button>
          </div>
        </section>

        <section id="generator" className="mt-[22px] grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-[16px] items-start">
          
          <div className="grid gap-[32px]">
            {/* Generator Card */}
            <div className="bg-gradient-to-b from-[rgba(255,255,255,.05)] to-[rgba(255,255,255,.02)] border border-[rgba(255,255,255,.08)] rounded-[20px] shadow-[0_18px_55px_rgba(0,0,0,.55)] overflow-hidden">
              <div className="px-[clamp(20px,3.2vw,32px)] pt-[clamp(16px,2.4vw,24px)] pb-[8px] flex items-center justify-between gap-[12px]">
                <div className="text-[14px] text-[rgba(243,244,246,.52)] tracking-[.02em] uppercase">1 · Настройки</div>
                <div className="text-[12px] text-[rgba(243,244,246,.52)]">Ссылка обновляется автоматически</div>
              </div>
              <div className="px-[clamp(20px,3.2vw,32px)] pt-[clamp(16px,2.4vw,24px)] pb-[clamp(16px,2.4vw,24px)]">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
                  
                  <div>
                    <label className="block text-[12px] text-[rgba(243,244,246,.52)] mb-[6px]">Модель устройства</label>
                    <select value={settings.model} onChange={e => setSettings({...settings, model: e.target.value as any})} className="w-full p-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-[rgba(0,0,0,.22)] text-[#f3f4f6] outline-none appearance-none focus:border-[rgba(124,92,255,.55)] focus:ring-4 focus:ring-[rgba(124,92,255,.12)]">
                      {Object.keys(DEVICES).map(k => <option key={k} value={k}>{DEVICES[k].name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] text-[rgba(243,244,246,.52)] mb-[6px]">Стиль</label>
                    <select value={settings.style} onChange={e => setSettings({...settings, style: e.target.value as any})} className="w-full p-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-[rgba(0,0,0,.22)] text-[#f3f4f6] outline-none appearance-none focus:border-[rgba(124,92,255,.55)] focus:ring-4 focus:ring-[rgba(124,92,255,.12)]">
                      <option value="dots">Dots</option>
                      <option value="squares">Squares</option>
                      <option value="bars">Bars</option>
                      <option value="rings">Rings</option>
                      <option value="numbers">Numbers (числа)</option>
                      <option value="numbers_current_month">Numbers (текущий месяц)</option>
                      <option value="dots_15_progress">Dots 15 в ряд (прогресс года)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] text-[rgba(243,244,246,.52)] mb-[6px]">Размер календаря</label>
                    <select value={settings.calendar_size} onChange={e => setSettings({...settings, calendar_size: e.target.value as any})} className="w-full p-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-[rgba(0,0,0,.22)] text-[#f3f4f6] outline-none appearance-none focus:border-[rgba(124,92,255,.55)] focus:ring-4 focus:ring-[rgba(124,92,255,.12)]">
                      <option value="standard">Стандартный</option>
                      <option value="large">Большой</option>
                      <option value="large_no_top">Большой без верхних виджетов</option>
                      <option value="large_no_bottom">Большой без нижних виджетов</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] text-[rgba(243,244,246,.52)] mb-[6px]">Выходные (только для чисел)</label>
                    <select value={settings.weekend_mode} onChange={e => setSettings({...settings, weekend_mode: e.target.value as any})} className="w-full p-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-[rgba(0,0,0,.22)] text-[#f3f4f6] outline-none appearance-none focus:border-[rgba(124,92,255,.55)] focus:ring-4 focus:ring-[rgba(124,92,255,.12)]">
                      <option value="weekends_only">Только выходные</option>
                      <option value="production_calendar">Производственный календарь</option>
                      <option value="none">Не отмечать</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] text-[rgba(243,244,246,.52)] mb-[6px]">Прозрачность фона</label>
                    <select value={settings.opacity} onChange={e => setSettings({...settings, opacity: parseInt(e.target.value)})} className="w-full p-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-[rgba(0,0,0,.22)] text-[#f3f4f6] outline-none appearance-none focus:border-[rgba(124,92,255,.55)] focus:ring-4 focus:ring-[rgba(124,92,255,.12)]">
                      <option value="0">0% (без прозрачности)</option>
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                      <option value="25">25%</option>
                      <option value="50">50%</option>
                      <option value="75">75%</option>
                    </select>
                    <span className="text-[12px] text-[rgba(243,244,246,.52)] block mt-1">Прозрачность фона нужна для вариантов со своей картинкой.</span>
                  </div>

                  <div>
                    <label className="block text-[12px] text-[rgba(243,244,246,.52)] mb-[6px]">Тема</label>
                    <select value={settings.theme} onChange={e => setSettings({...settings, theme: e.target.value as any})} className="w-full p-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-[rgba(0,0,0,.22)] text-[#f3f4f6] outline-none appearance-none focus:border-[rgba(124,92,255,.55)] focus:ring-4 focus:ring-[rgba(124,92,255,.12)]">
                      {Object.keys(THEMES).map(k => <option key={k} value={k}>{k.replace(/_/g, ' ').toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] text-[rgba(243,244,246,.52)] mb-[6px]">Язык</label>
                    <select value={settings.lang} onChange={e => setSettings({...settings, lang: e.target.value as any})} className="w-full p-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-[rgba(0,0,0,.22)] text-[#f3f4f6] outline-none appearance-none focus:border-[rgba(124,92,255,.55)] focus:ring-4 focus:ring-[rgba(124,92,255,.12)]">
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] text-[rgba(243,244,246,.52)] mb-[6px]">Часовой пояс</label>
                    <select value={settings.timezone} onChange={e => setSettings({...settings, timezone: parseInt(e.target.value)})} className="w-full p-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-[rgba(0,0,0,.22)] text-[#f3f4f6] outline-none appearance-none focus:border-[rgba(124,92,255,.55)] focus:ring-4 focus:ring-[rgba(124,92,255,.12)]">
                      <option value="-12">UTC-12</option>
                      <option value="-8">UTC-8 (Лос-Анджелес)</option>
                      <option value="-5">UTC-5 (Нью-Йорк)</option>
                      <option value="0">UTC+0 (Лондон)</option>
                      <option value="3">UTC+3 (Москва)</option>
                      <option value="7">UTC+7 (Бангкок)</option>
                      <option value="9">UTC+9 (Токио)</option>
                    </select>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[12px] text-[rgba(243,244,246,.52)] mb-[6px]">Надпись внизу</label>
                    <select value={settings.footer} onChange={e => setSettings({...settings, footer: e.target.value as any})} className="w-full p-[12px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-[rgba(0,0,0,.22)] text-[#f3f4f6] outline-none appearance-none focus:border-[rgba(124,92,255,.55)] focus:ring-4 focus:ring-[rgba(124,92,255,.12)]">
                      <option value="days_left_percent_left">Осталось дней + % осталось</option>
                      <option value="days_left_percent_done">Осталось дней + % прошло</option>
                      <option value="days_left">Осталось дней</option>
                      <option value="quote">Мотивирующая цитата</option>
                      <option value="none">Ничего</option>
                    </select>
                  </div>

                </div>

                <div className="mt-[24px] p-[12px] rounded-[14px] border border-dashed border-[rgba(255,255,255,.16)] bg-[rgba(0,0,0,.22)] font-mono text-[12px] leading-[1.45] break-all">
                  {getAutomationUrl()}
                </div>

                <div className="flex gap-[10px] flex-wrap mt-[16px]">
                  <button onClick={copyUrl} className="inline-flex items-center gap-[8px] px-[12px] py-[10px] rounded-full border border-[rgba(124,92,255,.35)] bg-[radial-gradient(120%_160%_at_20%_10%,rgba(124,92,255,.18),rgba(255,255,255,.03))] text-[#f3f4f6] cursor-pointer font-semibold text-[13px] hover:brightness-110">
                    {copied ? 'Скопировано ✓' : 'Скопировать ссылку'}
                  </button>
                  <a href={getAutomationUrl()} target="_blank" className="inline-flex items-center gap-[8px] px-[12px] py-[10px] rounded-full border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.03)] text-[rgba(243,244,246,.68)] no-underline cursor-pointer font-semibold text-[13px] hover:brightness-110">
                    Открыть PNG
                  </a>
                </div>

              </div>
            </div>

            <div className="bg-gradient-to-b from-[rgba(255,255,255,.05)] to-[rgba(255,255,255,.02)] border border-[rgba(255,255,255,.08)] rounded-[20px] shadow-[0_18px_55px_rgba(0,0,0,.55)] overflow-hidden">
               <div className="px-[clamp(20px,3.2vw,32px)] pt-[clamp(16px,2.4vw,24px)] pb-[8px] flex items-center justify-between gap-[12px]">
                 <div className="text-[14px] text-[rgba(243,244,246,.52)] tracking-[.02em] uppercase">2 · ОПИСАНИЕ</div>
               </div>
               <div className="px-[clamp(20px,3.2vw,32px)] pt-[clamp(16px,2.4vw,24px)] pb-[clamp(16px,2.4vw,24px)]">
                 <p className="m-0 text-[rgba(243,244,246,.68)] leading-[1.5]">
                    Привет! Это версия открытого генератора календаря-обоев. Здесь вы можете скопировать ссылку для <strong>Shortcuts (Команды iOS)</strong> или <strong>MacroDroid (Android)</strong>. Настройте "Получать содержимое страницы" по расписанию и передавайте картинку в обои!
                 </p>
                 <div className="text-[12px] text-[rgba(243,244,246,.52)] mt-4">
                  Чтобы добавить новые темы или стили, проверьте файл `src/types.ts` и `src/lib/drawUtils.ts` (помощь есть в INSTRUCTIONS.md).
                 </div>
               </div>
            </div>

          </div>

          <div className="bg-gradient-to-b from-[rgba(255,255,255,.05)] to-[rgba(255,255,255,.02)] border border-[rgba(255,255,255,.08)] rounded-[20px] shadow-[0_18px_55px_rgba(0,0,0,.55)] overflow-hidden">
            <div className="px-[clamp(20px,3.2vw,32px)] pt-[clamp(16px,2.4vw,24px)] pb-[8px] flex items-center justify-between gap-[12px]">
              <div className="text-[14px] text-[rgba(243,244,246,.52)] tracking-[.02em] uppercase">Preview</div>
              <div className="text-[12px] text-[rgba(243,244,246,.52)]">обновляется при смене параметров</div>
            </div>
            
            <div className="p-[16px]">
              <div className="w-full relative rounded-[18px] border border-[#222326] bg-[#0c1117] overflow-hidden">
                <canvas 
                  ref={canvasRef} 
                  width={device.width} 
                  height={device.height} 
                  className="w-full h-auto object-contain block"
                />
              </div>
            </div>
            
          </div>

        </section>

      </div>
    </div>
  );
}
