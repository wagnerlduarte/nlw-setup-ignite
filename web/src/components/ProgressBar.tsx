interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
      <div
        role="progressbar"
        aria-label="Progresso de hábitos completados nesse dia"
        aria-valuenow={progress}
        className="h-3 rounded-xl bg-violet-600 transition-all"
        style={{
          width: `${progress}%`,
        }}
      ></div>
    </div>
  );
};
