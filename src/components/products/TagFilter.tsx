import { useId } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { TagOption } from '@/utils/products';

type TagFilterProps = {
  options: TagOption[];
  /** Tag seleccionado o `null` para mostrar todos los productos. */
  selected: string | null;
  totalCount: number;
  onChange: (tag: string | null) => void;
};

const ALL_VALUE = '';

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** Filtro desplegable de productos por categoría (tag). */
export function TagFilter({ options, selected, totalCount, onChange }: TagFilterProps) {
  const id = useId();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor={id} className="inline-flex items-center gap-2 text-sm text-muted">
        <SlidersHorizontal className="size-4" />
        Filtrar por
      </label>
      <div className="relative">
        <select
          id={id}
          value={selected ?? ALL_VALUE}
          onChange={(event) => onChange(event.target.value || null)}
          className="h-11 min-w-56 cursor-pointer appearance-none rounded-full border border-ink/15 bg-ivory pr-10 pl-4 text-sm text-ink transition-colors hover:border-ink/40 focus:border-leather focus:ring-2 focus:ring-leather/15 focus:outline-none"
        >
          <option value={ALL_VALUE}>Todas las categorías ({totalCount})</option>
          {options.map(({ tag, count }) => (
            <option key={tag} value={tag} disabled={count === 0}>
              {capitalize(tag)} ({count})
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink/50" />
      </div>
      {selected && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <X className="size-3.5" />
          Limpiar
        </button>
      )}
    </div>
  );
}
