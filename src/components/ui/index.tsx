import React from "react";
import { cn } from "../../lib/utils";

// =====================
// BUTTON
// =====================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...props }: ButtonProps) {
  const base = "inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// =====================
// CARD
// =====================
interface CardProps {
  className?: string;
  children: React.ReactNode;
  glass?: boolean;
  hover?: boolean;
}

export function Card({ className, children, glass, hover }: CardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-blue-50 shadow-card",
      hover && "transition-all duration-200 hover:shadow-card-hover cursor-pointer",
      glass && "bg-white/70 backdrop-blur-sm border-white/80 shadow-glass",
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-5 py-4 border-b border-slate-100", className)}>{children}</div>;
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-5 py-4 border-t border-slate-100", className)}>{children}</div>;
}

// =====================
// BADGE
// =====================
interface BadgeProps {
  variant?: "green" | "red" | "yellow" | "blue" | "purple" | "gray" | "orange";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "gray", children, className }: BadgeProps) {
  const variants = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    gray: "bg-slate-100 text-slate-600 border-slate-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border", variants[variant], className)}>
      {children}
    </span>
  );
}

// =====================
// INPUT
// =====================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          id={id}
          className={cn(
            "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
            icon && "pl-9",
            error && "border-red-300 focus:ring-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// =====================
// SELECT
// =====================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <select
        id={id}
        className={cn(
          "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer",
          error && "border-red-300",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// =====================
// TEXTAREA
// =====================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <textarea
        id={id}
        className={cn(
          "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
          error && "border-red-300",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// =====================
// MODAL
// =====================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, size = "md", footer }: ModalProps) {
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative bg-white rounded-xl shadow-2xl w-full animate-slide-up max-h-[90vh] flex flex-col", sizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

// Need useEffect inside Modal
import { useEffect } from "react";

// =====================
// SKELETON (Loading)
// =====================
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-slate-200 rounded-md", className)} />;
}

// =====================
// EMPTY STATE
// =====================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-400">{icon}</div>}
      <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// =====================
// STAT CARD
// =====================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  subtitle?: string;
}

export function StatCard({ title, value, icon, iconBg = "bg-blue-100", change, changeType = "neutral", subtitle }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 mb-0.5">{title}</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          {change && (
            <p className={cn("text-xs font-medium mt-1",
              changeType === "up" && "text-emerald-600",
              changeType === "down" && "text-red-600",
              changeType === "neutral" && "text-slate-500"
            )}>
              {change}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

// =====================
// TABS
// =====================
interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
            activeTab === tab.id
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-semibold",
              activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"
            )}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// =====================
// TOAST (simple)
// =====================
export function Avatar({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-base" };
  const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={cn("rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0", sizes[size], color, className)}>
      {initials}
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-5 rounded-full transition-colors duration-200",
          checked ? "bg-blue-600" : "bg-slate-300"
        )}
      >
        <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0.5"
        )} />
      </button>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}

export function Checkbox({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label?: string; id?: string }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
      />
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}

export function Progress({ value, max = 100, className }: { value: number; max?: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full bg-slate-200 rounded-full h-2", className)}>
      <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Separator({ className }: { className?: string }) {
  return <hr className={cn("border-slate-100", className)} />;
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md", className)}>
      {children}
    </span>
  );
}
