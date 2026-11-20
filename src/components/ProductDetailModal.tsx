import { useEffect, useState } from 'react';
import {
  Check,
  Heart,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { Product, ProductReview } from '../types/marketplace';
import { SmartImage } from './SmartImage';

interface ProductDetailModalProps {
  product: Product | null;
  initialColor?: string;
  isWishlisted: boolean;
  reviews: ProductReview[];
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  onAddToBag: (
    product: Product,
    colorName: string,
    size: string,
    quantity: number
  ) => void;
  onOpenSizeGuide: () => void;
  onSubmitReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
}

export function ProductDetailModal({
  product,
  initialColor,
  isWishlisted,
  reviews,
  onClose,
  onToggleWishlist,
  onAddToBag,
  onOpenSizeGuide,
  onSubmitReview,
}: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFit, setReviewFit] = useState<ProductReview['fit']>('True to Size');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedColor(initialColor || product.colors[0].name);
      setSelectedSize(
        product.sizes.includes('M') ? 'M' : product.sizes[0]
      );
      setQuantity(1);
      setAddedFeedback(false);
      setReviewFormOpen(false);
      setReviewError('');
    }
  }, [product, initialColor]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    onAddToBag(product, selectedColor, selectedSize, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      setReviewError('Please enter your name and review comment.');
      return;
    }
    onSubmitReview(product.id, {
      author: reviewAuthor.trim(),
      rating: reviewRating,
      fit: reviewFit,
      comment: reviewComment.trim(),
    });
    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
    setReviewFit('True to Size');
    setReviewError('');
    setReviewFormOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 lg:p-6 bg-zinc-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-full sm:h-auto sm:max-h-[92vh] bg-white sm:rounded-2xl shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-8 py-4 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
          <p className="text-xs font-mono text-zinc-500">
            {product.sku} · {product.category} / {product.subcategory}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-zinc-950"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-6 space-y-6">
            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
              <SmartImage
                src={product.image}
                alt={product.name}
                title={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <p className="text-xs font-medium text-zinc-500 mb-1">Material &amp; Origin</p>
                <p className="text-sm text-zinc-900 leading-relaxed">{product.material}</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <p className="text-xs font-medium text-zinc-500 mb-1">Care Instructions</p>
                <p className="text-sm text-zinc-900 leading-relaxed">{product.care}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 text-xs text-zinc-500">
                <span className="font-medium text-zinc-700">{product.brand}</span>
                <span className="inline-flex items-center gap-1.5 tabular-nums text-zinc-800">
                  <Star className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" aria-hidden="true" />
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-500">
                    ({product.reviewCount + reviews.length} reviews)
                  </span>
                </span>
              </div>

              <h2
                id="pdp-title"
                className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 text-balance"
              >
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3 tabular-nums">
                <span className="text-2xl font-bold text-zinc-950">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-base text-zinc-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-red-700">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-6 space-y-5 pt-5 border-t border-zinc-200">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <span className="font-medium text-zinc-900">
                      Color: <span className="text-zinc-600 font-normal">{selectedColor}</span>
                    </span>
                    <span className="text-xs text-emerald-700 font-medium tabular-nums">
                      In stock ({product.stock} left)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color) => {
                      const active = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-colors min-h-[40px] focus-visible:outline-2 focus-visible:outline-zinc-950 ${
                            active
                              ? 'border-zinc-950 bg-zinc-50 text-zinc-950'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                          }`}
                          aria-pressed={active}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-zinc-300 shrink-0"
                            style={{ backgroundColor: color.hex }}
                            aria-hidden="true"
                          />
                          <span>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2.5">
                    <span className="font-medium text-zinc-900">
                      Size: <span className="text-zinc-600 font-normal">{selectedSize}</span>
                    </span>
                    <button
                      type="button"
                      onClick={onOpenSizeGuide}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-zinc-900 rounded"
                    >
                      <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const active = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors min-w-[48px] min-h-[40px] focus-visible:outline-2 focus-visible:outline-zinc-950 ${
                            active
                              ? 'border-zinc-950 bg-zinc-950 text-white'
                              : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                          }`}
                          aria-pressed={active}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2">
                  <div className="inline-flex items-center border border-zinc-200 rounded-lg h-11 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-full flex items-center justify-center text-zinc-700 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-zinc-950 rounded-l-lg"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-10 h-full flex items-center justify-center text-zinc-700 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-zinc-950 rounded-r-lg"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`flex-1 h-11 px-6 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
                      addedFeedback
                        ? 'bg-emerald-700 text-white'
                        : 'bg-zinc-950 text-white hover:bg-zinc-800'
                    }`}
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <span>
                        Add to Bag · ${(product.price * quantity).toFixed(2)}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    className={`w-11 h-11 shrink-0 rounded-lg border flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-zinc-950 ${
                      isWishlisted
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                    }`}
                    aria-label={isWishlisted ? 'Remove from saved items' : 'Save to wishlist'}
                    aria-pressed={isWishlisted}
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-800 shrink-0" aria-hidden="true" />
                <span>Free express shipping over $75</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-800 shrink-0" aria-hidden="true" />
                <span>30-day complimentary returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-8 pb-8 pt-6 border-t border-zinc-200 bg-zinc-50/70">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-zinc-950">
                Verified Fit &amp; Customer Reviews
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Showing {reviews.length} featured reviews for {product.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReviewFormOpen((prev) => !prev)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 transition-colors min-h-[40px] focus-visible:outline-2 focus-visible:outline-zinc-950"
            >
              {reviewFormOpen ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {reviewFormOpen && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-6 p-5 bg-white border border-zinc-200 rounded-xl space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="rev-author" className="block text-xs font-medium text-zinc-700 mb-1">
                    Your Name
                  </label>
                  <input
                    id="rev-author"
                    type="text"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. Jordan L."
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-950"
                  />
                </div>
                <div>
                  <label htmlFor="rev-rating" className="block text-xs font-medium text-zinc-700 mb-1">
                    Rating
                  </label>
                  <select
                    id="rev-rating"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg bg-white focus:outline-none focus:border-zinc-950"
                  >
                    <option value={5}>5 Stars — Exceptional</option>
                    <option value={4}>4 Stars — Very Good</option>
                    <option value={3}>3 Stars — Satisfactory</option>
                    <option value={2}>2 Stars — Fair</option>
                    <option value={1}>1 Star — Poor</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="rev-fit" className="block text-xs font-medium text-zinc-700 mb-1">
                    Fit Feedback
                  </label>
                  <select
                    id="rev-fit"
                    value={reviewFit}
                    onChange={(e) => setReviewFit(e.target.value as ProductReview['fit'])}
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg bg-white focus:outline-none focus:border-zinc-950"
                  >
                    <option value="Runs Small">Runs Small</option>
                    <option value="True to Size">True to Size</option>
                    <option value="Runs Large">Runs Large</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="rev-comment" className="block text-xs font-medium text-zinc-700 mb-1">
                  Review Comment
                </label>
                <textarea
                  id="rev-comment"
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share notes on fabric, drape, and sizing..."
                  className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-950"
                />
              </div>
              {reviewError && (
                <p className="text-xs text-red-700 font-medium" role="alert">
                  {reviewError}
                </p>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-zinc-950 text-white rounded-lg hover:bg-zinc-800 transition-colors min-h-[40px]"
              >
                Publish Review
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No reviews yet for this piece. Share the first fit note above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-white border border-zinc-200 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-zinc-900">
                      {rev.author} · <span className="font-normal text-zinc-500">{rev.fit}</span>
                    </span>
                    <span className="text-zinc-500 tabular-nums">
                      {rev.rating}.0 / 5 · {rev.date}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
