import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { Category } from '../types/marketplace';

interface NavbarProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  bagCount: number;
  onOpenBag: () => void;
  showPromoBar: boolean;
  onDismissPromoBar: () => void;
}

const NAV_CATEGORIES: Exclude<Category, Category.All>[] = [
  Category.Women,
  Category.Men,
  Category.Footwear,
  Category.Accessories,
  Category.Beauty,
];

export function Navbar({
  activeCategory,
  onSelectCategory,
  bagCount,
  onOpenBag,
  showPromoBar,
  onDismissPromoBar,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category: Category) => {
    onSelectCategory(category);
    setMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full">
      {showPromoBar && (
        <div className="bg-zinc-950 text-zinc-100 h-9 px-4 sm:px-6 flex items-center justify-between text-xs">
          <div className="w-6 shrink-0 hidden sm:block" aria-hidden="true" />
          <p className="truncate text-center tracking-wide">
            Complimentary express shipping over $75 · Use code{' '}
            <span className="font-mono font-medium text-white">KOVA20</span> for 20% off
          </p>
          <button
            type="button"
            onClick={onDismissPromoBar}
            className="p-1.5 -mr-1.5 text-zinc-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white rounded"
            aria-label="Dismiss promotion banner"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden -ml-2 p-2.5 text-zinc-700 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-zinc-900 rounded-md"
              aria-label={mobileMenuOpen ? 'Close category menu' : 'Open category menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(Category.All);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-display text-xl font-bold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-zinc-900 rounded"
            >
              KOVA
            </a>
          </div>

          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
            aria-label="Primary categories"
          >
            {NAV_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 focus-visible:outline-2 focus-visible:outline-zinc-900 ${
                    isActive
                      ? 'text-zinc-950 border-zinc-950'
                      : 'border-transparent hover:text-zinc-950 hover:border-zinc-300'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onOpenBag}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 min-h-[40px]"
              aria-label={`Open shopping bag with ${bagCount} items`}
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Bag</span>
              <span className="font-mono text-xs tabular-nums">({bagCount})</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategoryClick(Category.All)}
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeCategory === Category.All
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              All Drops
            </button>
            {NAV_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}
