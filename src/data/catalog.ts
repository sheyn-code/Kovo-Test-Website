import { Category, Product, ProductReview } from '../types/marketplace';

export const HERO_CAMPAIGN_IMAGE =
  '/src/assets/images/hero_fashion_campaign_1795032593256.jpg';

export const ATELIER_CRAFT_IMAGE =
  '/src/assets/images/editorial_atelier_craft_1795032598056.jpg';

export const FREE_SHIPPING_THRESHOLD = 75;
export const STANDARD_SHIPPING_FEE = 8;

export const PROMO_CODES: Record<
  string,
  { type: 'percent' | 'fixed'; value: number; label: string }
> = {
  KOVA20: { type: 'percent', value: 20, label: '20% off entire bag' },
  WELCOME10: { type: 'fixed', value: 10, label: '$10 off your order' },
};

export const PRODUCTS: Product[] = [
  {
    id: 'prod-linen-blazer',
    sku: 'KV-WN-104',
    name: 'Relaxed Double-Breasted Linen Blazer',
    brand: 'KOVA Studio',
    category: Category.Women,
    subcategory: 'Outerwear',
    tag: 'New Drop',
    price: 78,
    originalPrice: 98,
    rating: 4.9,
    reviewCount: 142,
    image: '/src/assets/images/product_linen_blazer_1795032593723.jpg',
    colors: [
      { name: 'Sandstone', hex: '#D6C7B2' },
      { name: 'Slate Charcoal', hex: '#3F3F46' },
      { name: 'Chalk White', hex: '#F4F4F5' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 18,
    description:
      'Cut in an airy European flax weave with lightly padded shoulders, horn-effect buttons, and a breathable half-lined interior designed for effortless layering.',
    material: '100% European Flax Linen · Cupro sleeve lining',
    care: 'Dry clean or cold gentle hand wash, steam lightly.',
    featuredRank: 1,
  },
  {
    id: 'prod-slip-dress',
    sku: 'KV-WN-218',
    name: 'Bias-Cut Silk Satin Midi Slip Dress',
    brand: 'Soraia',
    category: Category.Women,
    subcategory: 'Dresses',
    tag: 'Bestseller',
    price: 64,
    originalPrice: 84,
    rating: 4.8,
    reviewCount: 215,
    image: '/src/assets/images/product_slip_dress_1795032593841.jpg',
    colors: [
      { name: 'Espresso', hex: '#4A3228' },
      { name: 'Onyx', hex: '#18181B' },
      { name: 'Champagne', hex: '#E6D8C5' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 12,
    description:
      'Fluid bias-cut silhouette featuring a draped cowl neckline and fine adjustable rouleau straps that skim smoothly without clinging.',
    material: '19-Momme Mulberry Silk Satin Blend',
    care: 'Hand wash cold with silk detergent; dry flat in shade.',
    featuredRank: 2,
  },
  {
    id: 'prod-denim-jacket',
    sku: 'KV-MN-309',
    name: 'Washed Selvedge Utility Work Jacket',
    brand: 'Iron & Oak',
    category: Category.Men,
    subcategory: 'Jackets',
    tag: 'Limited Run',
    price: 89,
    originalPrice: 115,
    rating: 4.9,
    reviewCount: 96,
    image: '/src/assets/images/product_denim_jacket_1795032595245.jpg',
    colors: [
      { name: 'Washed Charcoal', hex: '#27272A' },
      { name: 'Raw Indigo', hex: '#1E293B' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 9,
    description:
      'Boxy workwear proportions built from 13.5oz enzyme-washed selvedge denim with triple-needle contrast seams and brushed pewter tack buttons.',
    material: '100% Organic Cotton 13.5oz Selvedge Denim',
    care: 'Machine wash cold inside out; hang dry.',
    featuredRank: 3,
  },
  {
    id: 'prod-knit-polo',
    sku: 'KV-MN-412',
    name: 'Fine Ribbed Merino Knit Polo',
    brand: 'KOVA Studio',
    category: Category.Men,
    subcategory: 'Knitwear',
    price: 58,
    rating: 4.7,
    reviewCount: 74,
    image: '/src/assets/images/product_knit_polo_1795032595276.jpg',
    colors: [
      { name: 'Ivory', hex: '#F3EFE6' },
      { name: 'Moss', hex: '#4B5842' },
      { name: 'Obsidian', hex: '#18181B' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24,
    description:
      'Breathable 12-gauge fisherman rib knit with mother-of-pearl placket buttons and structured cuffs that retain shape across seasons.',
    material: '100% Responsible Wool Standard Extra-Fine Merino',
    care: 'Cold wool cycle or hand wash; reshape while damp.',
    featuredRank: 4,
  },
  {
    id: 'prod-leather-tote',
    sku: 'KV-AC-501',
    name: 'Architectural Pebbled Leather Tote',
    brand: 'Monolith Goods',
    category: Category.Accessories,
    subcategory: 'Bags',
    tag: 'Bestseller',
    price: 112,
    originalPrice: 140,
    rating: 4.9,
    reviewCount: 189,
    image: '/src/assets/images/product_leather_tote_1795032595536.jpg',
    colors: [
      { name: 'Matte Black', hex: '#18181B' },
      { name: 'Warm Taupe', hex: '#A89F91' },
    ],
    sizes: ['One Size'],
    stock: 15,
    description:
      'Structured everyday carryall engineered to fit a 16-inch laptop with a center turn-lock closure, reinforced gussets, and interior zip pocket.',
    material: 'Full-Grain Vegetable-Tanned Calfskin · Cotton twill lining',
    care: 'Wipe with dry cloth; condition leather twice yearly.',
    featuredRank: 5,
  },
  {
    id: 'prod-chunky-loafers',
    sku: 'KV-FW-603',
    name: 'Brushed Leather Lug-Sole Penny Loafers',
    brand: 'Aethel',
    category: Category.Footwear,
    subcategory: 'Loafers',
    tag: 'New Drop',
    price: 96,
    originalPrice: 120,
    rating: 4.8,
    reviewCount: 112,
    image: '/src/assets/images/product_chunky_loafers_1795032595748.jpg',
    colors: [
      { name: 'Jet Black', hex: '#111113' },
      { name: 'Oxblood', hex: '#5C1E24' },
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    stock: 11,
    description:
      'Hand-stitched moccasin apron set atop a lightweight vulcanized Vibram-style lug sole with cushioned calfskin footbeds for all-day traction.',
    material: 'Box Calfskin Upper · Cushioned Leather Insole · Rubber Sole',
    care: 'Brush off dust after wear; use cedar shoe trees.',
    featuredRank: 6,
  },
  {
    id: 'prod-amber-serum',
    sku: 'KV-BT-708',
    name: 'Botanical Radiance Serum & Balm Duo',
    brand: 'Botanica Lab',
    category: Category.Beauty,
    subcategory: 'Skincare',
    price: 44,
    originalPrice: 54,
    rating: 4.9,
    reviewCount: 263,
    image: '/src/assets/images/product_amber_serum_1795032595736.jpg',
    colors: [{ name: 'Unscented Botanical', hex: '#B45309' }],
    sizes: ['30ml + 50g'],
    stock: 32,
    description:
      'Cold-pressed sea buckthorn facial oil paired with a ceramide barrier balm. Designed to restore winter moisture without pore congestion.',
    material: 'Squalane, Sea Buckthorn, Rosehip Seed Oil, Ceramide NP',
    care: 'Store below 25°C away from direct sunlight.',
    featuredRank: 7,
  },
  {
    id: 'prod-acetate-sunglasses',
    sku: 'KV-AC-815',
    name: 'Sculpted Bio-Acetate Sunglasses',
    brand: 'Monocerus',
    category: Category.Accessories,
    subcategory: 'Eyewear',
    price: 52,
    rating: 4.7,
    reviewCount: 68,
    image: '/src/assets/images/product_acetate_sunglasses_1795032596998.jpg',
    colors: [
      { name: 'Dark Tortoise', hex: '#452C1E' },
      { name: 'Black Smoke', hex: '#18181B' },
    ],
    sizes: ['One Size'],
    stock: 20,
    description:
      'Hand-beveled plant-based acetate frames fitted with 5-barrel steel hinges and UV400 anti-reflective olive tinted CR-39 lenses.',
    material: 'Mazzucchelli Bio-Acetate · CR-39 UV400 Lenses',
    care: 'Rinse with lukewarm water and wipe with microfiber pouch.',
    featuredRank: 8,
  },
];

export const INITIAL_REVIEWS: Record<string, ProductReview[]> = {
  'prod-linen-blazer': [
    {
      id: 'rev-1',
      author: 'Claire M.',
      rating: 5,
      fit: 'True to Size',
      date: 'Oct 2026',
      comment:
        'Drape is effortless over knitwear and tees. The linen has a substantial handfeel without wrinkling excessively.',
    },
    {
      id: 'rev-2',
      author: 'Hannah K.',
      rating: 5,
      fit: 'Runs Large',
      date: 'Nov 2026',
      comment:
        'Relaxed architectural cut as pictured. Take your regular size for the oversized look or size down for sharper shoulders.',
    },
  ],
  'prod-slip-dress': [
    {
      id: 'rev-3',
      author: 'Nadia V.',
      rating: 5,
      fit: 'True to Size',
      date: 'Nov 2026',
      comment:
        'Rich espresso shade looks far more expensive than the price point. Bias cut drapes cleanly without static.',
    },
  ],
  'prod-denim-jacket': [
    {
      id: 'rev-4',
      author: 'Marcus T.',
      rating: 5,
      fit: 'True to Size',
      date: 'Oct 2026',
      comment:
        'Heavyweight selvedge feel right out of the box, zero stiffness thanks to the wash. Hardware feels solid.',
    },
  ],
  'prod-leather-tote': [
    {
      id: 'rev-5',
      author: 'Elena R.',
      rating: 5,
      fit: 'True to Size',
      date: 'Nov 2026',
      comment:
        'Stands upright on its own even when loaded with a MacBook Pro and charger. Clean clasp detail.',
    },
  ],
};
