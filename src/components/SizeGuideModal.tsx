import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APPAREL_SIZES = [
  { size: 'XS', chestIn: '32–33', waistIn: '24–25', hipIn: '34–35', chestCm: '81–84', waistCm: '61–64', hipCm: '86–89' },
  { size: 'S', chestIn: '34–35', waistIn: '26–27', hipIn: '36–37', chestCm: '86–89', waistCm: '66–69', hipCm: '91–94' },
  { size: 'M', chestIn: '36–37', waistIn: '28–29', hipIn: '38–39', chestCm: '91–94', waistCm: '71–74', hipCm: '97–99' },
  { size: 'L', chestIn: '38–40', waistIn: '30–32', hipIn: '40–42', chestCm: '97–102', waistCm: '76–81', hipCm: '102–107' },
  { size: 'XL', chestIn: '41–43', waistIn: '33–35', hipIn: '43–45', chestCm: '104–109', waistCm: '84–89', hipCm: '109–114' },
];

const FOOTWEAR_SIZES = [
  { eu: '37', usW: '6.5', usM: '5', cm: '23.5' },
  { eu: '38', usW: '7.5', usM: '6', cm: '24.2' },
  { eu: '39', usW: '8.5', usM: '7', cm: '24.8' },
  { eu: '40', usW: '9.5', usM: '7.5', cm: '25.5' },
  { eu: '41', usW: '10.5', usM: '8.5', cm: '26.2' },
  { eu: '42', usW: '11', usM: '9', cm: '26.8' },
  { eu: '43', usW: '12', usM: '10', cm: '27.5' },
];

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [tab, setTab] = useState<'apparel' | 'footwear'>('apparel');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <h2 id="size-guide-title" className="font-display text-lg font-semibold text-zinc-950">
            Size &amp; Fit Guide
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-zinc-500 hover:text-zinc-950 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
              <button
                type="button"
                onClick={() => setTab('apparel')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  tab === 'apparel'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Apparel
              </button>
              <button
                type="button"
                onClick={() => setTab('footwear')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  tab === 'footwear'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Footwear
              </button>
            </div>

            {tab === 'apparel' && (
              <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    unit === 'in'
                      ? 'bg-white text-zinc-950 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Inches
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    unit === 'cm'
                      ? 'bg-white text-zinc-950 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Centimeters
                </button>
              </div>
            )}
          </div>

          {tab === 'apparel' ? (
            <div className="overflow-x-auto border border-zinc-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50 text-xs text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4 font-medium">Size</th>
                    <th className="py-3 px-4 font-medium">Chest ({unit})</th>
                    <th className="py-3 px-4 font-medium">Waist ({unit})</th>
                    <th className="py-3 px-4 font-medium">Hip ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 tabular-nums">
                  {APPAREL_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-zinc-50/60">
                      <td className="py-3 px-4 font-semibold text-zinc-950">{row.size}</td>
                      <td className="py-3 px-4 text-zinc-700">
                        {unit === 'in' ? row.chestIn : row.chestCm}
                      </td>
                      <td className="py-3 px-4 text-zinc-700">
                        {unit === 'in' ? row.waistIn : row.waistCm}
                      </td>
                      <td className="py-3 px-4 text-zinc-700">
                        {unit === 'in' ? row.hipIn : row.hipCm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto border border-zinc-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50 text-xs text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4 font-medium">EU</th>
                    <th className="py-3 px-4 font-medium">US Women</th>
                    <th className="py-3 px-4 font-medium">US Men</th>
                    <th className="py-3 px-4 font-medium">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 tabular-nums">
                  {FOOTWEAR_SIZES.map((row) => (
                    <tr key={row.eu} className="hover:bg-zinc-50/60">
                      <td className="py-3 px-4 font-semibold text-zinc-950">{row.eu}</td>
                      <td className="py-3 px-4 text-zinc-700">{row.usW}</td>
                      <td className="py-3 px-4 text-zinc-700">{row.usM}</td>
                      <td className="py-3 px-4 text-zinc-700">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-zinc-500 leading-relaxed">
            Measurements indicate body dimensions rather than garment flats. Oversized outerwear pieces are graded with an intentional 3–4 inch chest ease.
          </p>
        </div>
      </div>
    </div>
  );
}
