import React from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import { SaleRecord, Transaction } from "../../types";
import ReceiptModal from "../POS/ReceiptModal";

interface Props {
  modalState: {
    isOpen: boolean;
    type: "edit" | "delete" | "clear-all" | "print" | null;
    transaction: SaleRecord | null;
  };
  editSale: any;
  setEditSale: (value: any) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const TransactionModal: React.FC<Props> = ({
  modalState,
  editSale,
  setEditSale,
  onClose,
  onConfirm,
}) => {
  if (
    !modalState.isOpen ||
    (!modalState.transaction && modalState.type !== "clear-all")
  )
    return null;

  if (modalState.type === "print" && modalState.transaction) {
    return (
      <ReceiptModal
        transaction={{
          id: modalState.transaction.transactionId,
          timestamp: modalState.transaction.createdAt,
          cashierId: modalState.transaction.soldBy?.fullName ?? "N/A",
          items: modalState.transaction.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
          subtotal: modalState.transaction.total,
          discount: 0,
          total: modalState.transaction.total,
          paymentMethod: modalState.transaction.payment,
        }}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh] p-4 md:p-8 relative">
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
              modalState.type === "delete" || modalState.type === "clear-all"
                ? "bg-red-50 text-red-500"
                : "bg-zinc-100 text-zinc-900"
            }`}
          >
            {modalState.type === "delete" || modalState.type === "clear-all" ? (
              <Trash2 size={24} />
            ) : (
              <Pencil size={24} />
            )}
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 mb-2">
            {modalState.type === "delete"
              ? "Delete Transaction"
              : modalState.type === "clear-all"
                ? "Clear All History"
                : "Edit Transaction"}
          </h3>
          <p className="text-zinc-500">
            {modalState.type === "delete"
              ? `Are you sure you want to remove transaction #${modalState.transaction?._id}? This action cannot be undone.`
              : modalState.type === "clear-all"
                ? "Are you sure you want to delete ALL transaction history? This action is permanent and cannot be undone."
                : `Update details for transaction #${modalState.transaction?._id}.`}
          </p>
        </div>

        {modalState.type === "edit" && modalState.transaction && editSale && (
          <div className="bg-zinc-50 rounded-xl p-2 md:p-4 mb-6 border border-zinc-100 space-y-4">
            {editSale.items.map((item: any, index: number) => (
              <div
                key={index}
                className="space-y-2 border-b border-zinc-100 last:border-0 pb-3 last:pb-0"
              >
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500">
                    Item Name
                  </label>
                  <input
                    placeholder="Item name"
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...editSale.items];
                      updated[index].name = e.target.value;
                      setEditSale({ ...editSale, items: updated });
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500">
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...editSale.items];
                        updated[index].quantity = Number(e.target.value);
                        setEditSale({ ...editSale, items: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500">
                      Unit Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">
                        ₦
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2 rounded-lg border text-sm"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updated = [...editSale.items];
                          updated[index].unitPrice =
                            Number(e.target.value) || 0;
                          setEditSale({ ...editSale, items: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-1">
              <label
                htmlFor="payment-method"
                className="text-xs font-medium text-zinc-500"
              >
                Payment Method
              </label>
              <select
                id="payment-method"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={editSale?.payment ?? ""}
                onChange={(e) =>
                  setEditSale((prev: any) => ({
                    ...prev,
                    payment: e.target.value,
                  }))
                }
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-bold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] ${
              modalState.type === "delete" || modalState.type === "clear-all"
                ? "bg-red-500 shadow-red-500/20 hover:bg-red-600"
                : "bg-black shadow-zinc-900/10 hover:bg-zinc-800"
            }`}
          >
            {modalState.type === "delete" || modalState.type === "clear-all"
              ? "Confirm Delete"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
