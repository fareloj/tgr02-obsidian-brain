import React from "react";

export const ICONS: Record<string, string> = {
  network:
    '<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.4 13.4 7.2 4.2M15.6 6.4l-7.2 4.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.1-4.1"/>',
  message:
    '<path d="M21 14.5a2.5 2.5 0 0 1-2.5 2.5H8l-4 4V5.5A2.5 2.5 0 0 1 6.5 3h12A2.5 2.5 0 0 1 21 5.5z"/>',
  history:
    '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 7.5"/><path d="M3.5 4v3.5H7"/><path d="M12 8v4.2l3 1.8"/>',
  folder:
    '<path d="M4 20a2 2 0 0 1-2-2V6.5A2 2 0 0 1 4 4.5h5L11 7h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z"/>',
  more: '<circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
  settings:
    '<path d="M4 8h9M4 16h3M11 16h9M17 8h3"/><circle cx="15" cy="8" r="2.2"/><circle cx="9" cy="16" r="2.2"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 0 1 4.6 1.4c0 1.6-2.2 2-2.2 3.6"/><circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none"/>',
  paperclip:
    '<path d="M20.5 10 12 18.5a4 4 0 0 1-5.7-5.6l8-8a2.7 2.7 0 0 1 3.8 3.8l-8 8a1.4 1.4 0 0 1-2-2l7.2-7.2"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  "arrow-up": '<path d="M12 19V5.5M6.5 11 12 5.5 17.5 11"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  summary: '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
  link: '<path d="M9.5 12h5M10 8H8a4 4 0 0 0 0 8h2M14 8h2a4 4 0 0 1 0 8h-2"/>',
  spark:
    '<path d="M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7L12 16.1l-1.7-4.6L5.7 9.8l4.6-1.7z"/><path d="M18.5 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  edit: '<path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17.2z"/><path d="m13.5 7 3.5 3.5"/>',
  pin: '<path d="M9 3.5h6l-1 6 3 3v2H7v-2l3-3z"/><path d="M12 14.5v6"/>',
  tag: '<path d="M3 12.6V5a2 2 0 0 1 2-2h7.6L21 11.4a2 2 0 0 1 0 2.8l-6.8 6.8a2 2 0 0 1-2.8 0z"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19.5a2 2 0 0 0 4 0"/>',
  palette:
    '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.4 1-2 2-2h1a3 3 0 0 0 3-3 8 8 0 0 0-8-9z"/><circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="16.5" cy="11" r="1" fill="currentColor" stroke="none"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  logout: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M9 12h11M17 8l3 4-3 4"/>',
  check: '<path d="M5 12.5 10 17.5 19.5 7"/>',
  "chevron-right": '<path d="m9 6 6 6-6 6"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  doc: '<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M13.5 3v5h5M9 13h6M9 17h4"/>',
  sort: '<path d="M7 5v14M7 5 4 8M7 5l3 3M17 19V5M17 19l3-3M17 19l-3-3"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
};

type IconProps = {
  name: keyof typeof ICONS | string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function Icon({ name, size = 18, className = "", style }: IconProps) {
  return (
    <span
      className={`ic ${className}`}
      style={{ width: size, height: size, ...style }}
      dangerouslySetInnerHTML={{
        __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${
          ICONS[name] || ""
        }</svg>`,
      }}
    />
  );
}
