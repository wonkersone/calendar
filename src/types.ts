export type Theme = {
  bg: string;
  text: string;
  muted: string;
  dot: string;
  past: string;
  today: string;
  weekend: string;
  number: string;
  future: string;
};

export type Device = {
  name: string;
  width: number;
  height: number;
};

export type WallpaperSettings = {
  model: string;
  style: 'dots' | 'squares' | 'bars' | 'rings' | 'numbers' | 'numbers_current_month' | 'dots_15_progress';
  calendar_size: 'standard' | 'large' | 'large_no_top' | 'large_no_bottom';
  weekend_mode: 'weekends_only' | 'production_calendar' | 'none';
  footer: 'days_left_percent_left' | 'days_left_percent_done' | 'days_left' | 'quote' | 'none';
  timezone: number;
  opacity: number;
  lang: 'ru' | 'en';
  theme: string;
};

export const DEVICES: Record<string, Device> = {
  'iphone_6': { name: 'iPhone 6', width: 750, height: 1334 },
  'iphone_6_plus': { name: 'iPhone 6 Plus', width: 1080, height: 1920 },
  'iphone_6s': { name: 'iPhone 6s', width: 750, height: 1334 },
  'iphone_6s_plus': { name: 'iPhone 6s Plus', width: 1080, height: 1920 },
  'iphone_se_2016': { name: 'iPhone SE (2016)', width: 640, height: 1136 },
  'iphone_7': { name: 'iPhone 7', width: 750, height: 1334 },
  'iphone_7_plus': { name: 'iPhone 7 Plus', width: 1080, height: 1920 },
  'iphone_8': { name: 'iPhone 8', width: 750, height: 1334 },
  'iphone_8_plus': { name: 'iPhone 8 Plus', width: 1080, height: 1920 },
  'iphone_x': { name: 'iPhone X', width: 1125, height: 2436 },
  'iphone_xs': { name: 'iPhone XS', width: 1125, height: 2436 },
  'iphone_xs_max': { name: 'iPhone XS Max', width: 1242, height: 2688 },
  'iphone_xr': { name: 'iPhone XR', width: 828, height: 1792 },
  'iphone_11': { name: 'iPhone 11', width: 828, height: 1792 },
  'iphone_11_pro': { name: 'iPhone 11 Pro', width: 1125, height: 2436 },
  'iphone_11_pro_max': { name: 'iPhone 11 Pro Max', width: 1242, height: 2688 },
  'iphone_se_2020': { name: 'iPhone SE (2020)', width: 750, height: 1334 },
  'iphone_12': { name: 'iPhone 12', width: 1170, height: 2532 },
  'iphone_12_mini': { name: 'iPhone 12 mini', width: 1125, height: 2436 },
  'iphone_12_pro': { name: 'iPhone 12 Pro', width: 1170, height: 2532 },
  'iphone_12_pro_max': { name: 'iPhone 12 Pro Max', width: 1284, height: 2778 },
  'iphone_13_mini': { name: 'iPhone 13 mini', width: 1080, height: 2340 },
  'iphone_13': { name: 'iPhone 13', width: 1170, height: 2532 },
  'iphone_13_pro': { name: 'iPhone 13 Pro', width: 1170, height: 2532 },
  'iphone_13_pro_max': { name: 'iPhone 13 Pro Max', width: 1284, height: 2778 },
  'iphone_14': { name: 'iPhone 14', width: 1170, height: 2532 },
  'iphone_14_plus': { name: 'iPhone 14 Plus', width: 1284, height: 2778 },
  'iphone_14_pro': { name: 'iPhone 14 Pro', width: 1176, height: 2556 },
  'iphone_14_pro_max': { name: 'iPhone 14 Pro Max', width: 1290, height: 2796 },
  'iphone_15': { name: 'iPhone 15', width: 1179, height: 2556 },
  'iphone_15_plus': { name: 'iPhone 15 Plus', width: 1290, height: 2796 },
  'iphone_15_pro': { name: 'iPhone 15 Pro', width: 1179, height: 2556 },
  'iphone_15_pro_max': { name: 'iPhone 15 Pro Max', width: 1290, height: 2796 },
  'iphone_16': { name: 'iPhone 16', width: 1179, height: 2556 },
  'iphone_16_plus': { name: 'iPhone 16 Plus', width: 1290, height: 2796 },
  'iphone_16_pro': { name: 'iPhone 16 Pro', width: 1206, height: 2622 },
  'iphone_16_pro_max': { name: 'iPhone 16 Pro Max', width: 1320, height: 2868 },
  'iphone_16e': { name: 'iPhone 16e', width: 1170, height: 2532 },
  'iphone_17e': { name: 'iPhone 17e', width: 1170, height: 2532 },
  'iphone_17': { name: 'iPhone 17', width: 1290, height: 2796 },
  'iphone_17_pro': { name: 'iPhone 17 Pro', width: 1290, height: 2796 },
  'iphone_17_pro_max': { name: 'iPhone 17 Pro Max', width: 1320, height: 2868 },
  'iphone_air': { name: 'iPhone Air', width: 1320, height: 2868 },
};

export const THEMES: Record<string, Theme> = {
  "graphite_orange": {"bg":"#151617","text":"#B8B8B8","muted":"#7A7A7A","dot":"#E6E6E6","past":"#E6E6E6","today":"#0A84FF","weekend":"#FF7A2F","number":"#D0D0D0","future":"#D0D0D0"},
  "graphite_orange_oled": {"bg":"#000000","text":"#B8B8B8","muted":"#7A7A7A","dot":"#E6E6E6","past":"#E6E6E6","today":"#0A84FF","weekend":"#FF7A2F","number":"#D0D0D0","future":"#D0D0D0"},
  "midnight_blue": {"bg":"#0F1720","text":"#C6D0E0","muted":"#7E8CA3","dot":"#E2E9F5","past":"#E2E9F5","today":"#FF9500","weekend":"#4DA3FF","number":"#EDF3FA","future":"#D4E3F8"},
  "midnight_blue_oled": {"bg":"#000000","text":"#C6D0E0","muted":"#7E8CA3","dot":"#E2E9F5","past":"#E2E9F5","today":"#FF9500","weekend":"#4DA3FF","number":"#EDF3FA","future":"#D4E3F8"},
  "forest_green": {"bg":"#101815","text":"#C7D6CE","muted":"#7E9489","dot":"#E1EFE8","past":"#E1EFE8","today":"#FF3B30","weekend":"#2ED573","number":"#EDF7F1","future":"#E0F2E4"},
  "forest_green_oled": {"bg":"#000000","text":"#C7D6CE","muted":"#7E9489","dot":"#E1EFE8","past":"#E1EFE8","today":"#FF3B30","weekend":"#2ED573","number":"#EDF7F1","future":"#E0F2E4"},
  "sand_terracotta": {"bg":"#F3EFEA","text":"#4A3F35","muted":"#8E8175","dot":"#3A2F26","past":"#3A2F26","today":"#007AFF","weekend":"#D2693C","number":"#2A2218","future":"#2A2218"},
  "sand_terracotta_oled": {"bg":"#000000","text":"#4A3F35","muted":"#8E8175","dot":"#3A2F26","past":"#3A2F26","today":"#007AFF","weekend":"#D2693C","number":"#f9f3eb","future":"#f9f3eb"},
  "violet_focus": {"bg":"#14101C","text":"#D7CFF5","muted":"#8C84B2","dot":"#EEE9FF","past":"#EEE9FF","today":"#FFD60A","weekend":"#9B7CFF","number":"#F5F0FF","future":"#F5F0FF"},
  "violet_focus_oled": {"bg":"#000000","text":"#D7CFF5","muted":"#8C84B2","dot":"#EEE9FF","past":"#EEE9FF","today":"#FFD60A","weekend":"#9B7CFF","number":"#F5F0FF","future":"#F5F0FF"},
  "minimal_red": {"bg":"#141414","text":"#CFCFCF","muted":"#7C7C7C","dot":"#F0F0F0","past":"#F0F0F0","today":"#32D74B","weekend":"#FF4D4D","number":"#FAFAFA","future":"#FAFAFA"},
  "minimal_red_oled": {"bg":"#000000","text":"#CFCFCF","muted":"#7C7C7C","dot":"#F0F0F0","past":"#F0F0F0","today":"#32D74B","weekend":"#FF4D4D","number":"#FAFAFA","future":"#FAFAFA"}
};
