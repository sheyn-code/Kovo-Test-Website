import { useEffect } from 'react';
import { Package, X } from 'lucide-react';
import { OrderRecord, PaymentMethod } from '../types/marketplace';

interface OrdersModalProps {
  isOpen: boolean;
  orders: OrderRecord[];
  onClose: () => void;
}

export function OrdersModal({ isOpen, orders, onClose }: OrdersModalProps) {
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
      aria-labelledby="orders-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <h2 id="orders-modal-title" className="font-display text-lg font-semibold text-zinc-950">
            Order History &amp; Tracking
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-zinc-500 hover:text-zinc-950 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close order history"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
                <Package className="w-5 h-5 text-zinc-500" aria-hidden="true" />
              </div>
              <p className="font-display text-base font-semibold text-zinc-950">
                No orders placed yet
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Completed checkouts will appear here with real-time order confirmation numbers.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-zinc-200 rounded-xl space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-semibold text-zinc-950">
                    Order #{order.id}
                  </span>
                  <span className="text-emerald-800 font-medium">{order.status}</span>
                </div>

                <div className="space-y-1.5 text-sm">
                  {order.items.map((item) => (
                    <div key={item.key} className="flex justify-between gap-2 text-zinc-700">
                      <span className="truncate">
                        {item.quantity}× {item.name} ({item.color}, {item.size})
                      </span>
                      <span className="tabular-nums shrink-0 font-medium text-zinc-950">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <span>
                    {order.createdAt} ·{' '}
                    {order.paymentMethod === PaymentMethod.CashOnDelivery
                      ? 'Cash on Delivery'
                      : 'Card'}
                  </span>
                  <span className="text-sm font-semibold text-zinc-950 tabular-nums">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
