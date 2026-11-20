import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Heart,
  Package,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CartDrawer } from './components/CartDrawer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { OrdersModal } from './components/OrdersModal';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SmartImage } from './components/SmartImage';
import {
  ATELIER_CRAFT_IMAGE,
  INITIAL_REVIEWS,
  PRODUCTS,
} from './data/catalog';
import {
  CartItem,
  Category,
  OrderRecord,
  PaymentMethod,
  Product,
  ProductReview,
  ShippingDetails,
  SortOption,
} from './types/marketplace';

const CATEGORY_TABS: Category[] = [
  Category.All,
  Category.Women,
  Category.Men,
  Category.Footwear,
  Category.Accessories,
  Category.Beauty,
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [showPromoBar, setShowPromoBar] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.All);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.Featured);
  const [onlySaved, setOnlySaved] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>('kova_cart_v1', [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readStorage<string[]>('kova_wishlist_v1', [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    readStorage<OrderRecord[]>('kova_orders_v1', [])
  );
  const [reviewsByProduct, setReviewsByProduct] = useState<
    Record<string, ProductReview[]>
  >(() => readStorage<Record<string, ProductReview[]>>('kova_reviews_v1', INITIAL_REVIEWS));

  const [selectedProduct, setSelectedProduct] = useState<{
    product: Product;
    initialColor?: string;
  } | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'error' | 'subscribed'
  >('idle');

  useEffect(() => {
    try {
      window.localStorage.setItem('kova_cart_v1', JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem('kova_wishlist_v1', JSON.stringify(wishlist));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      window.localStorage.setItem('kova_orders_v1', JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'kova_reviews_v1',
        JSON.stringify(reviewsByProduct)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [reviewsByProduct]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const bagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((product) => {
      if (activeCategory !== Category.All && product.category !== activeCategory) {
        return false;
      }
      if (onlySaved && !wishlist.includes(product.id)) {
        return false;
      }
      if (query) {
        const haystack = `${product.name} ${product.brand} ${product.category} ${product.subcategory} ${product.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case SortOption.PriceAsc:
          return a.price - b.price;
        case SortOption.PriceDesc:
          return b.price - a.price;
        case SortOption.TopRated:
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case SortOption.Featured:
        default:
          return a.featuredRank - b.featuredRank;
      }
    });
  }, [activeCategory, searchQuery, sortBy, onlySaved, wishlist]);

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToBag = (
    product: Product,
    colorName: string,
    size: string,
    quantity = 1
  ) => {
    const key = `${product.id}__${colorName}__${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: product.price,
          color: colorName,
          size,
          quantity,
        },
      ];
    });
    setToastMessage(`Added ${product.name} (${size}) to bag`);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handlePlaceOrder = (orderData: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    promoCode?: string;
    paymentMethod: PaymentMethod;
    shipping: ShippingDetails;
  }): OrderRecord => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRecord = {
      id: `KV-${randomNum}`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Confirmed — Preparing Shipment',
      items: cart,
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const handleSubmitReview = (
    productId: string,
    review: Omit<ProductReview, 'id' | 'date'>
  ) => {
    const entry: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
    };
    setReviewsByProduct((prev) => ({
      ...prev,
      [productId]: [entry, ...(prev[productId] || [])],
    }));
    setToastMessage('Review published');
  };

  const handleResetFilters = () => {
    setActiveCategory(Category.All);
    setSearchQuery('');
    setOnlySaved(false);
    setSortBy(SortOption.Featured);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('subscribed');
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setOnlySaved(false);
        }}
        bagCount={bagCount}
        onOpenBag={() => setBagOpen(true)}
        showPromoBar={showPromoBar}
        onDismissPromoBar={() => setShowPromoBar(false)}
      />

      <main className="flex-1">
        <Hero
          onShopNow={scrollToCatalog}
          onOpenSizeGuide={() => setSizeGuideOpen(true)}
        />

        <section
          id="catalog"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
            <div>
              <p className="text-xs font-medium text-zinc-500">
                Marketplace Catalog · {filteredProducts.length} items
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                {onlySaved
                  ? 'Saved Wishlist'
                  : activeCategory === Category.All
                  ? 'Featured Drop'
                  : `${activeCategory} Collection`}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search
                  className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blazers, silk, bags..."
                  aria-label="Search marketplace products"
                  className="w-full h-10 pl-9 pr-8 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 p-1"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOnlySaved((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 h-10 px-3.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-zinc-950 ${
                  onlySaved
                    ? 'bg-zinc-950 text-white border-zinc-950'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                }`}
                aria-pressed={onlySaved}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${onlySaved ? 'fill-current' : ''}`}
                  aria-hidden="true"
                />
                <span>Saved</span>
                <span className="font-mono tabular-nums">({wishlist.length})</span>
              </button>

              <div className="relative inline-flex items-center">
                <SlidersHorizontal
                  className="w-3.5 h-3.5 text-zinc-500 absolute left-3 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort products"
                  className="h-10 pl-8 pr-4 text-xs font-medium bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-zinc-950"
                >
                  <option value={SortOption.Featured}>Sort: Featured</option>
                  <option value={SortOption.PriceAsc}>Price: Low to High</option>
                  <option value={SortOption.PriceDesc}>Price: High to Low</option>
                  <option value={SortOption.TopRated}>Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5 mb-8 flex items-center gap-1.5 overflow-x-auto pb-1">
            {CATEGORY_TABS.map((cat) => {
              const active = activeCategory === cat && !onlySaved;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setOnlySaved(false);
                  }}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px] focus-visible:outline-2 focus-visible:outline-zinc-950 ${
                    active
                      ? 'bg-zinc-950 text-white'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 px-6 text-center bg-white border border-zinc-200 rounded-2xl">
              <p className="font-display text-lg font-semibold text-zinc-950">
                No matching pieces found
              </p>
              <p className="mt-1.5 text-sm text-zinc-500 max-w-md mx-auto">
                {onlySaved
                  ? 'You have not saved any items to your wishlist yet, or none match your current search.'
                  : 'Try clearing your search query or switching to All categories.'}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 text-sm font-medium bg-zinc-950 text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenDetail={(prod, initialColor) =>
                    setSelectedProduct({ product: prod, initialColor })
                  }
                  onQuickAdd={(prod, colorName, size) =>
                    handleAddToBag(prod, colorName, size, 1)
                  }
                />
              ))}
            </div>
          )}
        </section>

        <section
          id="atelier"
          className="bg-white border-t border-b border-zinc-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-6">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[280px] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                  <SmartImage
                    src={ATELIER_CRAFT_IMAGE}
                    alt="Organic linen bolts, raw wool swatches, and brass tailoring shears on an oak workbench"
                    title="Atelier Textile Standards"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between py-1">
                <div>
                  <p className="text-xs font-medium text-zinc-500">
                    Atelier Standards · Direct Sourcing
                  </p>
                  <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 text-balance">
                    Small-batch runs, direct-to-wardrobe pricing.
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
                    Every partner label on KOVA produces in verified small batches
                    using traceable European flax, RWS merino wool, and vegetable-tanned
                    leather. By shipping straight from regional hubs, we cut traditional
                    retail markups while backing every order with 30-day returns.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-200 grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tabular-nums">
                      48h
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Average dispatch window
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tabular-nums">
                      96%
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      True-to-size fit score
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-zinc-950 tabular-nums">
                      4.8 / 5
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Across 12,400+ orders
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-zinc-950 text-white rounded-lg hover:bg-zinc-800 transition-colors min-h-[42px]"
                  >
                    <span>Open Size &amp; Fit Chart</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdersOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-zinc-300 bg-white text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors min-h-[42px]"
                  >
                    <Package className="w-4 h-4" aria-hidden="true" />
                    <span>Order History ({orders.length})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-950 text-zinc-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-zinc-800">
            <div className="md:col-span-4 space-y-3">
              <p className="font-display text-xl font-bold text-white tracking-tight">
                KOVA
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                Multi-category fashion and lifestyle marketplace connecting
                independent ateliers with everyday wardrobes.
              </p>
            </div>

            <div className="md:col-span-2 space-y-2.5 text-sm">
              <p className="font-semibold text-white">Departments</p>
              <ul className="space-y-2 text-zinc-400">
                {[
                  Category.Women,
                  Category.Men,
                  Category.Footwear,
                  Category.Accessories,
                  Category.Beauty,
                ].map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat);
                        setOnlySaved(false);
                        scrollToCatalog();
                      }}
                      className="hover:text-white transition-colors"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 space-y-2.5 text-sm">
              <p className="font-semibold text-white">Client Care</p>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="hover:text-white transition-colors"
                  >
                    Size &amp; Fit Guide
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setOrdersOpen(true)}
                    className="hover:text-white transition-colors"
                  >
                    Track Orders ({orders.length})
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setBagOpen(true)}
                    className="hover:text-white transition-colors"
                  >
                    Shopping Bag ({bagCount})
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <p className="text-sm font-semibold text-white">
                Early Drop Dispatch
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Receive restock alerts and 20% welcome access with code KOVA20.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus !== 'idle') setNewsletterStatus('idle');
                  }}
                  placeholder="Enter your email"
                  aria-label="Email address for early drop alerts"
                  className="flex-1 px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-white text-zinc-950 rounded-lg hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0"
                >
                  Join
                </button>
              </form>
              {newsletterStatus === 'error' && (
                <p className="text-xs text-red-400" role="alert">
                  Please enter a valid email address.
                </p>
              )}
              {newsletterStatus === 'subscribed' && (
                <p className="text-xs text-emerald-400">
                  Subscribed. Check your inbox for KOVA20.
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© 2026 KOVA Marketplace. All rights reserved.</p>
            <p>Express Delivery · Card &amp; Cash on Delivery Supported</p>
          </div>
        </div>
      </footer>

      <ProductDetailModal
        product={selectedProduct?.product || null}
        initialColor={selectedProduct?.initialColor}
        isWishlisted={
          selectedProduct
            ? wishlist.includes(selectedProduct.product.id)
            : false
        }
        reviews={
          selectedProduct
            ? reviewsByProduct[selectedProduct.product.id] || []
            : []
        }
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToBag={handleAddToBag}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        onSubmitReview={handleSubmitReview}
      />

      <CartDrawer
        isOpen={bagOpen}
        items={cart}
        onClose={() => setBagOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <OrdersModal
        isOpen={ordersOpen}
        orders={orders}
        onClose={() => setOrdersOpen(false)}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 bg-zinc-950 text-white text-xs font-medium rounded-xl shadow-lg"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setBagOpen(true)}
            className="ml-1 underline underline-offset-2 text-zinc-200 hover:text-white whitespace-nowrap"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
