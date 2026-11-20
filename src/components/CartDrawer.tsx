import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import {
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  STANDARD_SHIPPING_FEE,
} from '../data/catalog';
import {
  CartItem,
  OrderRecord,
  PaymentMethod,
  ShippingDetails,
} from '../types/marketplace';
import { SmartImage } from './SmartImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onPlaceOrder: (orderData: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    promoCode?: string;
    paymentMethod: PaymentMethod;
    shipping: ShippingDetails;
  }) => OrderRecord;
  onOpenOrders: () => void;
}

type DrawerStep = 'bag' | 'checkout' | 'confirmed';

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onOpenOrders,
}: CartDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('bag');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Card);
  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && step === 'confirmed' && items.length > 0) {
      setStep('bag');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promoRule = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const discount = promoRule
    ? promoRule.type === 'percent'
      ? Math.round(subtotal * (promoRule.value / 100) * 100) / 100
      : Math.min(subtotal, promoRule.value)
    : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const shippingFee =
    items.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const total = discountedSubtotal + shippingFee;
  const shippingProgress = Math.min(
    100,
    Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try KOVA20 or WELCOME10.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shipping.fullName.trim() ||
      !shipping.email.trim() ||
      !shipping.phone.trim() ||
      !shipping.address.trim() ||
      !shipping.city.trim() ||
      !shipping.postalCode.trim()
    ) {
      setCheckoutError('Please complete all delivery and contact fields.');
      return;
    }
    setCheckoutError('');
    const created = onPlaceOrder({
      subtotal,
      discount,
      shippingFee,
      total,
      promoCode: appliedPromo || undefined,
      paymentMethod,
      shipping,
    });
    setConfirmedOrder(created);
    setAppliedPromo(null);
    setStep('confirmed');
  };

  const handleClose = () => {
    if (step === 'confirmed') {
      setStep('bag');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                className="p-1.5 -ml-1.5 text-zinc-600 hover:text-zinc-950 rounded-md focus-visible:outline-2 focus-visible:outline-zinc-950"
                aria-label="Back to shopping bag"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <h2 className="font-display text-lg font-semibold text-zinc-950">
              {step === 'bag' && `Shopping Bag (${items.reduce((s, i) => s + i.quantity, 0)})`}
              {step === 'checkout' && 'Express Checkout'}
              {step === 'confirmed' && 'Order Receipt'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 -mr-2 text-zinc-500 hover:text-zinc-950 rounded-lg focus-visible:outline-2 focus-visible:outline-zinc-950 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {step === 'bag' && (
          <>
            {items.length > 0 && (
              <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200">
                <div className="flex items-center justify-between text-xs text-zinc-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-zinc-800" aria-hidden="true" />
                    {freeShippingRemaining === 0 ? (
                      <span className="font-medium text-emerald-800">
                        Free express shipping unlocked
                      </span>
                    ) : (
                      <span>
                        Add <strong className="tabular-nums">${freeShippingRemaining.toFixed(2)}</strong> for free express shipping
                      </span>
                    )}
                  </span>
                  <span className="font-mono tabular-nums text-zinc-500">{shippingProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-950 transition-all duration-300"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-5 h-5 text-zinc-500" aria-hidden="true" />
                  </div>
                  <p className="font-display text-base font-semibold text-zinc-950">
                    Your bag is empty
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 max-w-[26ch]">
                    Browse the catalog to add tailored outerwear, knitwear, or leather goods.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-6 px-5 py-2.5 text-sm font-medium bg-zinc-950 text-white rounded-lg hover:bg-zinc-800 transition-colors min-h-[42px]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-4 pb-5 border-b border-zinc-100 last:border-b-0"
                  >
                    <div className="w-24 aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        title={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-zinc-950 leading-snug line-clamp-1">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            className="p-1 text-zinc-400 hover:text-red-700 rounded focus-visible:outline-2 focus-visible:outline-zinc-950"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {item.color} · Size {item.size}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center border border-zinc-200 rounded-md h-8">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, -1)}
                            className="w-7 h-full flex items-center justify-center text-zinc-600 hover:text-zinc-950"
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            <Minus className="w-3 h-3" aria-hidden="true" />
                          </button>
                          <span className="w-7 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, 1)}
                            className="w-7 h-full flex items-center justify-center text-zinc-600 hover:text-zinc-950"
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            <Plus className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-zinc-950 tabular-nums">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-4">
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. KOVA20)"
                      aria-label="Promo code"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-950 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-medium bg-white border border-zinc-300 text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-700" role="alert">
                      {promoError}
                    </p>
                  )}
                  {appliedPromo && promoRule && (
                    <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
                      <span>
                        Code {appliedPromo} applied ({promoRule.label})
                      </span>
                      <button
                        type="button"
                        onClick={() => setAppliedPromo(null)}
                        className="underline hover:text-emerald-950"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                <div className="space-y-1.5 text-sm pt-2 border-t border-zinc-200">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount ({appliedPromo})</span>
                      <span className="tabular-nums">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600">
                    <span>Express Shipping</span>
                    <span className="tabular-nums">
                      {shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-zinc-950 text-base pt-2 border-t border-zinc-200">
                    <span>Total</span>
                    <span className="tabular-nums">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors min-h-[44px]"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {step === 'checkout' && (
          <form
            onSubmit={handleCheckoutSubmit}
            className="flex-1 flex flex-col overflow-y-auto"
          >
            <div className="flex-1 p-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 mb-3">
                  Shipping &amp; Verification Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="ship-name" className="block text-xs font-medium text-zinc-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="ship-name"
                      type="text"
                      value={shipping.fullName}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, fullName: e.target.value }))
                      }
                      placeholder="Alex Morgan"
                      className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-950"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="ship-email" className="block text-xs font-medium text-zinc-700 mb-1">
                        Email
                      </label>
                      <input
                        id="ship-email"
                        type="email"
                        value={shipping.email}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, email: e.target.value }))
                        }
                        placeholder="alex@example.com"
                        className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-950"
                      />
                    </div>
                    <div>
                      <label htmlFor="ship-phone" className="block text-xs font-medium text-zinc-700 mb-1">
                        Phone
                      </label>
                      <input
                        id="ship-phone"
                        type="tel"
                        value={shipping.phone}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, phone: e.target.value }))
                        }
                        placeholder="+1 415 555 0192"
                        className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-950"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ship-address" className="block text-xs font-medium text-zinc-700 mb-1">
                      Street Address
                    </label>
                    <input
                      id="ship-address"
                      type="text"
                      value={shipping.address}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, address: e.target.value }))
                      }
                      placeholder="420 Mercer St, Apt 4B"
                      className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-950"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="ship-city" className="block text-xs font-medium text-zinc-700 mb-1">
                        City
                      </label>
                      <input
                        id="ship-city"
                        type="text"
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, city: e.target.value }))
                        }
                        placeholder="New York"
                        className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-950"
                      />
                    </div>
                    <div>
                      <label htmlFor="ship-postal" className="block text-xs font-medium text-zinc-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        id="ship-postal"
                        type="text"
                        value={shipping.postalCode}
                        onChange={(e) =>
                          setShipping((s) => ({ ...s, postalCode: e.target.value }))
                        }
                        placeholder="10013"
                        className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-950"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200">
                <h3 className="text-sm font-semibold text-zinc-950 mb-3">
                  Payment Method
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod(PaymentMethod.Card)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      paymentMethod === PaymentMethod.Card
                        ? 'border-zinc-950 bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-zinc-900 mb-1.5" aria-hidden="true" />
                    <p className="text-xs font-semibold text-zinc-950">Card / Apple Pay</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Instant confirmation</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod(PaymentMethod.CashOnDelivery)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      paymentMethod === PaymentMethod.CashOnDelivery
                        ? 'border-zinc-950 bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-zinc-900 mb-1.5" aria-hidden="true" />
                    <p className="text-xs font-semibold text-zinc-950">Cash on Delivery</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Pay courier on arrival</p>
                  </button>
                </div>
              </div>

              {checkoutError && (
                <p className="text-xs text-red-700 font-medium" role="alert">
                  {checkoutError}
                </p>
              )}
            </div>

            <div className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-zinc-600">
                  Order Total ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="text-lg font-bold text-zinc-950 tabular-nums">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors min-h-[44px]"
              >
                Place Order · ${total.toFixed(2)}
              </button>
            </div>
          </form>
        )}

        {step === 'confirmed' && confirmedOrder && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2.5 text-emerald-900 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>
                    Order #{confirmedOrder.id} {confirmedOrder.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-emerald-800 leading-relaxed">
                  Receipt dispatched to {confirmedOrder.shipping.email}. Estimated
                  courier arrival in 2–4 business days.
                </p>
              </div>

              <div className="border border-zinc-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Summary
                </p>
                <div className="space-y-2 text-sm">
                  {confirmedOrder.items.map((item) => (
                    <div key={item.key} className="flex justify-between gap-3">
                      <span className="text-zinc-700 truncate">
                        {item.quantity}× {item.name} ({item.size})
                      </span>
                      <span className="tabular-nums font-medium text-zinc-950 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-zinc-200 flex justify-between font-semibold text-zinc-950">
                  <span>
                    Total Paid (
                    {confirmedOrder.paymentMethod === PaymentMethod.CashOnDelivery
                      ? 'COD'
                      : 'Card'}
                    )
                  </span>
                  <span className="tabular-nums">${confirmedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border border-zinc-200 rounded-xl p-4 text-xs text-zinc-600 space-y-1">
                <p className="font-semibold text-zinc-900">Delivering To</p>
                <p>{confirmedOrder.shipping.fullName}</p>
                <p>
                  {confirmedOrder.shipping.address}, {confirmedOrder.shipping.city}{' '}
                  {confirmedOrder.shipping.postalCode}
                </p>
                <p>{confirmedOrder.shipping.phone}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onOpenOrders();
                }}
                className="w-full py-2.5 px-4 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-medium rounded-lg transition-colors"
              >
                View Order History
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Back to Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
