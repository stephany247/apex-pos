import React from "react";
import { Printer, X } from "lucide-react";
import { Transaction } from "../../types";
import { formatCurrency } from "@/utils";

interface ReceiptModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            type="button"
            aria-label="Close receipt"
            onClick={onClose}
            className="p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Receipt Content */}
        <div
          className="px-8 pb-8 overflow-y-auto bg-white text-zinc-800 font-mono text-sm leading-relaxed"
          id="receipt-content"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">
              Apex POS
            </h2>
            <p className="text-xs text-zinc-500">
              123 Commerce St, Business City
            </p>
            <p className="text-xs text-zinc-500">Tel: +1 234 567 890</p>
          </div>

          <div className="border-b-2 border-dashed border-zinc-200 my-4" />

          <div className="flex justify-between text-xs mb-1">
            <span>
              Date:{" "}
              {new Date(transaction.timestamp).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
            <span>
              Time:{" "}
              {new Date(transaction.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span>Trans ID:</span>
            <span>#{transaction.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Cashier:</span>
            <span>{transaction.cashierId}</span>
          </div>

          <div className="border-b-2 border-dashed border-zinc-200 my-4" />

          <div className="space-y-3">
            {transaction.items.map((item, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-bold capitalize">{item.name}</span>
                <div className="flex justify-between pl-4 text-zinc-500">
                  <span>
                    {item.quantity} x ₦{formatCurrency(item.price)}
                  </span>
                  <span className="text-zinc-800 font-semibold">
                    ₦{formatCurrency(item.quantity * item.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-b-2 border-dashed border-zinc-200 my-4" />

          <div className="space-y-1 text-base">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{formatCurrency(transaction.subtotal)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>-₦{formatCurrency(transaction.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl mt-2">
              <span>TOTAL</span>
              <span>₦{formatCurrency(transaction.total)}</span>
            </div>
          </div>

          <div className="border-b-2 border-dashed border-zinc-200 my-4" />

          <div className="text-center space-y-2">
            <div className="flex justify-center items-center gap-2 text-sm font-bold bg-zinc-100 py-1 rounded">
              <span>Payment: {transaction.paymentMethod}</span>
            </div>
            <p className="text-xs mt-4">Thank you for shopping with us!</p>
            <p className="text-xs">Please keep this receipt for returns.</p>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="w-48 h-12 bg-zinc-100 rounded flex items-center justify-center">
              <div className="flex gap-1 h-8 items-center opacity-50">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-${Math.random() > 0.5 ? "0.5" : "1"} h-full bg-black`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-zinc-600 font-bold hover:bg-zinc-200 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 bg-black text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-content, #receipt-content * { visibility: visible; }
          #receipt-content {
            position: absolute;
            left: 0; top: 0;
            width: 100%;
            margin: 0; padding: 0;
            background: white;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptModal;
