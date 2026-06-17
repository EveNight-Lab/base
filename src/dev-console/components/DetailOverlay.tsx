interface DetailOverlayProps {
  detail: {
    name: string;
    description: string;
    type: string;
  };
  onClose: () => void;
}

export default function DetailOverlay({ detail, onClose }: DetailOverlayProps) {
  return (
    <div className="absolute inset-0 bg-[#0A0D17]/95 flex flex-col justify-center p-8 z-30 border-t border-indigo-950/80">
      <div className="max-w-xl mx-auto w-full bg-[#111625] border border-[#222E50] rounded-xl p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-0.75rem font-mono"
        >
          닫기 ✕
        </button>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-[10px] px-2.5 py-0.5 rounded font-semibold ${
              detail.type.includes('In')
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-900/50'
                : detail.type.includes('Out')
                  ? 'bg-rose-950 text-rose-300 border border-rose-900/50'
                  : 'bg-indigo-950 text-indigo-300 border border-indigo-900/50'
            }`}
          >
            {detail.type}
          </span>
          <h4 className="text-0.875rem font-bold text-white font-mono">{detail.name}</h4>
        </div>
        <p className="text-0.875rem text-gray-300 leading-relaxed border-t border-white/5 pt-3">
          {detail.description}
        </p>
      </div>
    </div>
  );
}
