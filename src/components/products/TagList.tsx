import { parseTags } from '@/utils/products';
import { cn } from '@/utils/cn';

type TagListProps = {
  tags: string;
  max?: number;
  className?: string;
};

export function TagList({ tags, max, className }: TagListProps) {
  const list = parseTags(tags);
  const visible = max ? list.slice(0, max) : list;
  if (visible.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Etiquetas">
      {visible.map((tag) => (
        <li key={tag} className="rounded-full border border-ink/10 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-ink/60">
          {tag}
        </li>
      ))}
    </ul>
  );
}
