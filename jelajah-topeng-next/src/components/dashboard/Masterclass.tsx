"use client";

export default function Masterclass({
  time,
  title,
  maestro,
  place,
  onClick,
}: {
  time: string;
  title: string;
  maestro: string;
  place: string;
  onClick: () => void;
}) {
  const [dateLabel, timeLabel] = time.split(" · ");

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left transition hover:bg-slate-50"
    >
      <div className="flex w-24 shrink-0 flex-col items-center justify-center self-stretch rounded-xl bg-emerald-50 px-2 py-3 text-center">
        <span className="text-[11px] font-bold leading-tight text-emerald-700">
          {dateLabel}
        </span>
        {timeLabel && (
          <span className="mt-1 text-[10px] font-semibold leading-tight text-emerald-700">
            {timeLabel}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-xs text-emerald-700">{maestro}</p>
        <p className="mt-1 text-xs text-slate-400">{place}</p>
      </div>
    </button>
  );
}
