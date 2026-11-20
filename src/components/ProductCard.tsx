import { useState } from 'react';
import { Check, Heart, Plus, Star } from 'lucide-react';
import { Product } from '../types/marketplace';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenDetail: (product: Product, selectedColorName: string) => void;
  onQuickAdd: (product: Product, colorName: string, size: string) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenDetail,
  onQuickAdd,
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];
  const defaultSize = product.sizes.includes('M')
    ? 'M'
    : product.sizes[Math.min(1, product.sizes.length - 1)] || product.sizes[0];

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product, selectedColor.name, defaultSize);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden">
        <button
          type="button"
          onClick={() => onOpenDetail(product, selectedColor.name)}
          className="block w-full h-full text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-zinc-950"
          aria-label={`View details for ${product.name}`}
        >
          <SmartImage
            src={product.image}
            alt={product.name}
            title={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-zinc-950 ${
            isWishlisted
              ? 'bg-zinc-950 text-white'
              : 'bg-white/90 text-zinc-700 hover:bg-white hover:text-zinc-950'
          }`}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from saved items`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
            <span className="truncate">
              {product.brand} · {product.subcategory}
              {product.tag ? ` · ${product.tag}` : ''}
            </span>
            <span className="inline-flex items-center gap-1 shrink-0 tabular-nums text-zinc-700 font-medium">
              <Star className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" aria-hidden="true" />
              {product.rating.toFixed(1)}
            </span>
          </div>

          <h3 className="mt-1.5 font-display text-base font-semibold text-zinc-950 leading-snug line-clamp-1">
            <button
              type="button"
              onClick={() => onOpenDetail(product, selectedColor.name)}
              className="text-left hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-zinc-900 rounded"
            >
              {product.name}
            </button>
          </h3>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" role="group" aria-label="Color options">
              {product.colors.map((color, idx) => {
                const isSelected = idx === selectedColorIndex;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                    aria-pressed={isSelected}
                    className={`w-5 h-5 rounded-full border transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
                      isSelected
                        ? 'border-zinc-950 ring-1 ring-zinc-950 ring-offset-1 scale-105'
                        : 'border-zinc-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
              <span className="ml-1 text-xs text-zinc-500 truncate max-w-[110px]">
                {selectedColor.name}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-[15px] font-semibold text-zinc-950">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-zinc-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-red-700">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAddClick}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-zinc-950 text-white hover:bg-zinc-800'
            }`}
            aria-label={`Quick add ${product.name} in ${selectedColor.name}, size ${defaultSize}`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add · {defaultSize}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
