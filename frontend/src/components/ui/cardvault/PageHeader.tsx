import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string, path: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, breadcrumbs }) => {
  return (
    <div className="mb-8">
      {breadcrumbs && (
        <nav className="flex items-center gap-2 text-[10px] font-bold text-ab-muted uppercase tracking-widest mb-4">
          <span className="hover:text-ab-red cursor-pointer">Home</span>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={10} />
              <span className={i === breadcrumbs.length - 1 ? 'text-ab-red' : 'hover:text-ab-red cursor-pointer'}>
                {b.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-ab-navy tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-ab-text-light mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </div>
  );
};
