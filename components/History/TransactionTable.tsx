import React from "react";
import { CreditCard, Banknote, ArrowRightLeft, Package, Pencil, Trash2, Printer } from "lucide-react";
import { SaleRecord } from "../../types";
import { formatCurrency } from "@/utils";
import { Loader2 } from "lucide-react";

interface Props {
  sales: SaleRecord[];
  isLoading: boolean;
  error: unknown;
  selectedDate: string;
  onEdit: (transaction: SaleRecord) => void;
  onDelete: (transaction: SaleRecord) => void;
  onPrint: (transaction: SaleRecord) => void;
}

const TransactionTable: React.FC<Props> = ({
  sales,
  isLoading,
  error,
  selectedDate,
  onEdit,
  onDelete,
  onPrint,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center h-48 text-zinc-500 font-medium">
        <Loader2 className="animate-spin" size={36} />
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500">
        Failed to load transactions.
      </div>
    );
  }

  return (
    <>
      <table className="w-full min-w-max text-left border-collapse">
        <thead className="bg-[#F4E6CB] sticky top-0 z-10">
          <tr>
            <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">Transaction ID</th>
            <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">Date</th>
            <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">Time</th>
            <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">Items</th>
            <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">Total</th>
            <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">Payment</th>
            <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {sales.map((transaction) => (
            <tr key={transaction._id} className="hover:bg-zinc-50/50 group transition-colors">
              <td className="p-2 font-medium text-zinc-600 text-sm align-top">
                #{transaction._id}
              </td>
              <td className="p-2 align-top">
                <div className="text-zinc-600 font-medium text-sm">
                  {new Date(transaction.date).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                  })}
                </div>
              </td>
              <td className="p-2 align-top">
                <div className="text-zinc-600 font-medium text-sm whitespace-nowrap">
                  {transaction.time}
                </div>
              </td>
              <td className="p-2 align-top">
                <div className="flex flex-col gap-2">
                  {transaction.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-zinc-100 last:border-0 pb-2 last:pb-0 gap-2">
                      <span className="font-medium text-zinc-900 text-sm line-clamp-2 capitalize">{item.name}</span>
                      <span className="text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md font-mono text-xs font-bold whitespace-nowrap flex-shrink-0">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                  {transaction.items.length === 0 && (
                    <span className="text-zinc-400 italic text-sm">No items</span>
                  )}
                </div>
              </td>
              <td className="p-2 font-bold text-zinc-900 text-sm align-top">
                ₦{formatCurrency(transaction.total)}
              </td>
              <td className="p-2 align-top">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                  transaction.payment === "cash" ? "bg-green-50 text-green-700 border-green-100"
                  : transaction.payment === "card" ? "bg-blue-50 text-blue-700 border-blue-100 whitespace-nowrap"
                  : "bg-purple-50 text-purple-700 border-purple-100"
                }`}>
                  {transaction.payment === "cash" && <Banknote size={12} />}
                  {transaction.payment === "card" && <CreditCard size={12} />}
                  {transaction.payment === "transfer" && <ArrowRightLeft size={12} />}
                  {transaction.payment}
                </div>
              </td>
              <td className="p-2 text-right align-top">
                <div className="flex items-center justify-end gap-2">
                  <button type="button" onClick={() => onEdit(transaction)} className="p-2 text-zinc-500 bg-zinc-100 hover:bg-black hover:text-white rounded-full transition-all" title="Edit Transaction">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => onDelete(transaction)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-full transition-all" title="Delete Transaction">
                    <Trash2 size={14} />
                  </button>
                  <button type="button" onClick={() => onPrint(transaction)} className="p-2 text-zinc-500 bg-zinc-100 hover:bg-black hover:text-white rounded-full transition-all" title="Print Receipt">
                    <Printer size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sales.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
          <Package size={48} className="mb-4 opacity-20" />
          <p>{selectedDate ? "No transactions found for this date." : "No transactions found."}</p>
        </div>
      )}
    </>
  );
};

export default TransactionTable;