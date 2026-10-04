import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Award, Hammer, Leaf, SearchX, Truck } from 'lucide-react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ProductGrid, ProductGridSkeleton, TagFilter } from '@/components/products';
import { Button, ButtonLink, EmptyState, ErrorState } from '@/components/ui';
import { carouselSlides } from '@/data/carouselSlides';
import { PRODUCT_CATEGORIES } from '@/data/productCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useProducts } from '@/hooks/useProducts';
import { getTagOptions, productHasTag } from '@/utils/products';

const VALUES = [
  { icon: Leaf, title: 'Curtido al vegetal', text: 'Cueros vacunos curtidos con taninos naturales, sin cromo.' },
  { icon: Hammer, title: 'Hecho a mano', text: 'Cortamos, cosemos y terminamos cada pieza en nuestro taller.' },
  { icon: Award, title: 'Garantía de 2 años', text: 'Respaldamos cada costura y cada herraje que sale del taller.' },
  { icon: Truck, title: 'Envíos a todo el país', text: 'Coordinamos la entrega por WhatsApp, a tu medida.' },
];

const WORKSHOP_IMAGE =
  'https://images.unsplash.com/photo-1608731267464-c0c889c2ff92?auto=format&fit=crop&w=1200&q=80';

export function HomePage() {
  useDocumentTitle();
  const { products, isLoading, isError, error, refetch } = useProducts();

  const featured = products.filter((product) => product.stock > 0).slice(0, 3);

  // El tag seleccionado vive en la URL (/?tag=bolsos) para poder compartir o recargar el filtro.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag')?.trim().toLowerCase() || null;
  const tagOptions = useMemo(() => getTagOptions(products, PRODUCT_CATEGORIES), [products]);
  const filteredProducts = useMemo(
    () => (selectedTag ? products.filter((product) => productHasTag(product, selectedTag)) : products),
    [products, selectedTag],
  );

  const filterRef = useRef<HTMLDivElement>(null);
  const filterChangedByUser = useRef(false);

  // Si el listado se achica, la página puede quedar desplazada más allá de los productos:
  // tras un cambio de filtro se vuelve a mostrar el filtro cuando quedó fuera de pantalla.
  useEffect(() => {
    if (!filterChangedByUser.current) return;
    filterChangedByUser.current = false;
    const element = filterRef.current;
    if (!element) return;
    const { top } = element.getBoundingClientRect();
    if (top < 0 || top > window.innerHeight) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedTag]);

  const handleTagChange = (tag: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (tag) next.set('tag', tag);
    else next.delete('tag');
    filterChangedByUser.current = true;
    setSearchParams(next, { replace: true, preventScrollReset: true, state: { preserveScroll: true } });
  };

  return (
    <>
      <HeroCarousel slides={carouselSlides} />

      {/* Propuesta de valor */}
      <section aria-label="Por qué elegirnos" className="border-b border-ink/10">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 py-8 lg:px-6 lg:first:pl-0">
              <Icon className="mt-0.5 size-5 shrink-0 text-leather" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Texto promocional */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:py-32">
        <p className="text-xs font-medium tracking-[0.3em] text-leather uppercase">Nueva temporada</p>
        <p className="mt-6 font-serif text-3xl leading-snug font-medium text-balance sm:text-4xl lg:text-5xl">
          Piezas pensadas para durar toda una vida, que se vuelven más lindas con cada año de uso.
        </p>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">
          Label
        </p>
      </section>

      {/* Destacados */}
      {featured.length > 0 && (
        <section aria-labelledby="destacados-title" className="bg-ivory py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading id="destacados-title" eyebrow="Selección del taller" title="Destacados" />
            <ProductGrid products={featured} className="mt-12" />
          </div>
        </section>
      )}

      {/* Colección completa */}
      <section id="coleccion" aria-labelledby="coleccion-title" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            id="coleccion-title"
            eyebrow="Colección completa"
            title="Nuestros productos"
            description="Billeteras, cinturones, carteras y bolsos confeccionados en cuero genuino."
          />
          {!isLoading && !isError && (
            <div ref={filterRef} className="mt-10 scroll-mt-24">
              <TagFilter
                options={tagOptions}
                selected={selectedTag}
                totalCount={products.length}
                onChange={handleTagChange}
              />
            </div>
          )}
          <div className="mt-10">
            {isLoading ? (
              <ProductGridSkeleton />
            ) : isError ? (
              <ErrorState title="Error al cargar productos" message={error ?? ''} onRetry={refetch} />
            ) : products.length === 0 ? (
              <EmptyState
                title="Estamos renovando la colección"
                description="Muy pronto vas a encontrar nuevas piezas en la tienda."
              />
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                icon={<SearchX />}
                title="No hay productos con esta etiqueta"
                description={`No encontramos productos etiquetados como "${selectedTag}".`}
                action={
                  <Button variant="outline" onClick={() => handleTagChange(null)}>
                    Ver todos los productos
                  </Button>
                }
              />
            ) : (
              <>
                {selectedTag && (
                  <p className="mb-8 text-sm text-muted" aria-live="polite">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} en{' '}
                    <span className="font-medium text-ink capitalize">{selectedTag}</span>
                  </p>
                )}
                <ProductGrid products={filteredProducts} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* El taller */}
      <section id="taller" aria-labelledby="taller-title" className="scroll-mt-20 bg-espresso text-ivory">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={WORKSHOP_IMAGE}
              alt="Portadocumentos de cuero terminado en el taller"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.3em] text-sand uppercase">El taller</p>
            <h2 id="taller-title" className="mt-4 text-4xl font-semibold sm:text-5xl">
              Oficio heredado, diseño de hoy
            </h2>
            <p className="mt-6 leading-relaxed text-ivory/70">
              Desde 2009 trabajamos el cuero como se hacía antes: elegimos cada lonja a mano, cortamos con cuchilla y
              cosemos con punto talabartero. El resultado son piezas sobrias, resistentes y con una pátina que cuenta
              la historia de quien las usa.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-ivory/10 pt-8">
              {[
                ['5+', 'años de oficio'],
                ['100%', 'hecho a mano'],
                ['2 años', 'de garantía'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-serif text-3xl font-semibold text-sand sm:text-4xl">{value}</dd>
                  <dd className="mt-1 text-xs tracking-wide text-ivory/50">{label}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink to="/#coleccion" variant="outline-light" className="mt-10">
              Explorar la colección
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium tracking-[0.3em] text-leather uppercase">{eyebrow}</p>
        <h2 id={id} className="mt-3 text-4xl font-semibold sm:text-5xl">
          {title}
        </h2>
      </div>
      {description && <p className="max-w-sm text-sm leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
