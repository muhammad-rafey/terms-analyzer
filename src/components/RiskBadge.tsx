import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import type { RiskLevel } from '@/types/analysis';

const config = {
  LOW: {
    icon: ShieldCheck,
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    label: 'Low Risk',
  },
  MEDIUM: {
    icon: ShieldAlert,
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    label: 'Medium Risk',
  },
  HIGH: {
    icon: ShieldX,
    className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    label: 'High Risk',
  },
};

interface Props {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export default function RiskBadge({ level, size = 'md' }: Props) {
  const { icon: Icon, className, label } = config[level];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : size === 'lg' ? 'px-4 py-2 text-base gap-2' : 'px-3 py-1 text-sm gap-1.5';
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 20 : 15;

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${className}`}>
      <Icon size={iconSize} />
      {label}
    </span>
  );
}
