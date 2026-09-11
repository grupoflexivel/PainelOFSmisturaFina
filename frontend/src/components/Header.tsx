import { useEffect, useState } from "react";

interface HeaderProps {
  atualizadoEm: string | undefined;
  fetchedAt: string | undefined;
  refreshIntervalMs: number;
  connectionError: boolean;
  stale: boolean;
  quantidadeAProduzir: string | undefined;
  quantidadeDeOFs: string | undefined;
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Stat({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">{label}</span>
      <span className={emphasize ? "font-mono text-base font-bold text-accent" : "font-mono text-xs text-ink"}>{value}</span>
    </div>
  );
}

export function Header({
  atualizadoEm,
  fetchedAt,
  refreshIntervalMs,
  connectionError,
  stale,
  quantidadeAProduzir,
  quantidadeDeOFs,
}: HeaderProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const msUntilNext = fetchedAt ? new Date(fetchedAt).getTime() + refreshIntervalMs - now : null;

  const status = connectionError
    ? { text: "sem conexão", dotClass: "bg-bad" }
    : stale
      ? { text: "dados desatualizados", dotClass: "bg-st-recebido-rail" }
      : { text: "ao vivo", dotClass: "bg-good animate-pulse" };

  return (
    <header className="border-b border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">Painel de OFs</span>
          <h1 className="text-3xl font-extrabold uppercase text-accent">Mistura fina - Matriz</h1>
        </div>
        <div className="flex items-center gap-6">
          {quantidadeAProduzir !== undefined && <Stat label="a produzir" value={quantidadeAProduzir} emphasize />}
          {quantidadeDeOFs !== undefined && <Stat label="OFs" value={quantidadeDeOFs} emphasize />}
          <Stat label="atualizado em" value={atualizadoEm ?? "—"} />
          {msUntilNext !== null && !connectionError && <Stat label="próxima em" value={formatCountdown(msUntilNext)} />}
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
            <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
            {status.text}
          </span>
        </div>
      </div>
    </header>
  );
}
