"use client";

import { Icon } from "../Icon";

type ViewHeaderProps = {
  onOpenSidebar: () => void;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
};

export function ViewHeader({ onOpenSidebar, title, subtitle, actions }: ViewHeaderProps) {
  return (
    <header className="flex-shrink-0 flex items-center gap-3 px-4 md:px-10 pt-7 pb-4">
      <button
        onClick={onOpenSidebar}
        className="md:hidden w-10 h-10 grid place-items-center rounded-full text-on-surface-variant hover:bg-container-high"
      >
        <Icon name="menu" size={22} />
      </button>
      <div>
        <h2 className="font-headline text-[26px] font-semibold tracking-[-0.02em] text-on-surface">
          {title}
        </h2>
        <p className="font-body text-[14px] text-on-surface-variant mt-0.5">{subtitle}</p>
      </div>
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </header>
  );
}
