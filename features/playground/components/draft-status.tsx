export interface DraftStatusProps {
  readonly message: string;
  readonly tone: "default" | "error";
}

export function DraftStatus({ message, tone }: DraftStatusProps) {
  return <p className={`playground-draft-status playground-draft-status--${tone}`}>{message}</p>;
}
