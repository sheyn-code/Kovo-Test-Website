import { ArrowRight } from 'lucide-react';
import { HERO_CAMPAIGN_IMAGE } from '../data/catalog';
import { SmartImage } from './SmartImage';

interface HeroProps {
  onShopNow: () => void;
  onOpenSizeGuide: () => void;
}

export function Hero({ onShopNow, onOpenSizeGuide }: HeroProps) {
  return (
    <section
      id="top"
      className="bg-white border-b border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between py-2 lg:py-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-zinc-500 mb-4">
                Autumn–Winter Edit · 2026 Marketplace Drop
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-zinc-950 leading-[1.1] text-balance max-w-xl">
                Curated essentials, priced for everyday rotation.
              </h1>
              <p className="mt-5 text-base text-zinc-600 leading-relaxed max-w-md">
                Tailored linen outerwear, bias-cut silk, heavyweight selvedge, and
                architectural leather accessories—direct from independent ateliers
                with 48-hour dispatch.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onShopNow}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 min-h-[44px]"
              >
                <span>Shop the Collection</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="px-4 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-950 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-zinc-900 rounded min-h-[44px]"
              >
                Sizing &amp; Fit Guide
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-full min-h-[300px] lg:min-h-[440px] overflow-hidden rounded-xl bg-zinc-100">
              <SmartImage
                src={HERO_CAMPAIGN_IMAGE}
                alt="Two models wearing sand wool trench coat and charcoal knitwear inside a sunlit concrete gallery"
                title="Autumn–Winter Editorial Campaign"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                <div>
                  <p className="text-xs text-zinc-200">Featured Lookbook</p>
                  <p className="text-sm font-semibold">
                    Outerwear, Fine Merino &amp; Lug-Sole Footwear
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums text-zinc-200 whitespace-nowrap">
                  From $44
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
