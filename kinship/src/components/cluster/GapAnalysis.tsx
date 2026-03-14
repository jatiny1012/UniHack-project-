import { AlertTriangle, Lightbulb } from "lucide-react";

export function GapAnalysis({ gaps }: { gaps: string[] }) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 bg-success/5 rounded-xl border border-success/20">
        <span className="text-success">✅</span>
        <p className="text-sm text-success font-medium">All major needs are covered in your cluster!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {gaps.map((gap, i) => (
        <div key={i} className="flex items-start gap-2 p-3 bg-accent/5 rounded-xl border border-accent/20">
          <AlertTriangle size={16} className="text-accent mt-0.5 shrink-0" />
          <p className="text-sm text-textDark">{gap}</p>
        </div>
      ))}
      <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-xl">
        <Lightbulb size={16} className="text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-primary">Know someone nearby who could help? Invite them!</p>
      </div>
    </div>
  );
}
