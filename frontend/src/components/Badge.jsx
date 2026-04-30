export default function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    primary: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}
