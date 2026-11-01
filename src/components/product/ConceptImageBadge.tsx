interface ConceptImageBadgeProps {
  className?: string;
}

export function ConceptImageBadge({ className = '' }: ConceptImageBadgeProps) {
  return (
    <span
      role="note"
      className={`pointer-events-none inline-flex flex-col rounded-md bg-[#292724]/90 px-2 py-1 text-left text-[8px] leading-tight text-white shadow-sm ${className}`}
    >
      <span className="font-semibold uppercase tracking-wide">AI-generated concept</span>
      <span>Not a verified product photo</span>
    </span>
  );
}
