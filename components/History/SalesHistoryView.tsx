import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import {
  Search,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  ChevronRight,
  Package,
  X,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Transaction } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSale, getSales, updateSale } from "@/api/sales";
import { formatCurrency } from "@/utils";

const SalesHistoryView: React.FC = () => {
  const { transactions, clearTransactions } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editSale, setEditSale] = useState<any>(null);

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "edit" | "delete" | "clear-all" | null;
    transaction: Transaction | null;
  }>({ isOpen: false, type: null, transaction: null });

  const { data, isLoading, error } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });
  const sales = data?.data?.sales || [];
  console.log("FULL SALES RESPONSE:", data);

  const filteredTransactions = sales.filter((t) => {
    const matchesSearch =
      t._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.items.some((i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    // Filter by date (YYYY-MM-DD matches the start of ISO string)
    const matchesDate = selectedDate
      ? new Date(t.date).toISOString().slice(0, 10) === selectedDate
      : true;

    return matchesSearch && matchesDate;
  });

  const queryClient = useQueryClient();

  const updateSaleMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateSale(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["sales"] });

      const previousSales = queryClient.getQueryData(["sales"]);

      queryClient.setQueryData(["sales"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            sales: old.data.sales.map((sale: any) =>
              sale._id === id ? { ...sale, ...data } : sale,
            ),
          },
        };
      });

      return { previousSales };
    },

    onError: (_err, _vars, context) => {
      console.error("Update failed:", _err);
      queryClient.setQueryData(["sales"], context?.previousSales);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  const deleteSaleMutation = useMutation({
    mutationFn: (id: string) => deleteSale(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["sales"] });
      const previousSales = queryClient.getQueryData(["sales"]);

      queryClient.setQueryData(["sales"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            sales: old.data.sales.filter((sale: any) => sale._id !== id),
          },
        };
      });

      return { previousSales };
    },

    onError: (_err, _vars, context) => {
      console.error("Delete failed:", _err);
      queryClient.setQueryData(["sales"], context?.previousSales);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  const handleOpenModal = (
    type: "edit" | "delete" | "clear-all",
    transaction?: Transaction | null,
  ) => {
    if (type === "edit" && transaction) {
      setEditSale({
        items: transaction.items.map((item: any) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        payment: transaction.payment,
      });
    }
    setModalState({ isOpen: true, type, transaction: transaction || null });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: null, transaction: null });
  };

  const handleConfirmAction = () => {
    if (modalState.type === "edit" && modalState.transaction) {
      updateSaleMutation.mutate({
        id: modalState.transaction._id,
        data: editSale,
      });
    }

    if (modalState.type === "clear-all") {
      clearTransactions();
    }

    if (modalState.type === "delete" && modalState.transaction) {
      deleteSaleMutation.mutate(modalState.transaction._id);
    }

    handleCloseModal();
  };

  const nairaFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-[2rem] shadow-sm border border-zinc-100 relative">
      <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-zinc-100 flex-shrink-0">
        <h2 className="text-xl font-bold text-zinc-900 whitespace-nowrap">
          Recent Transactions
        </h2>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-72">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border-none rounded-full focus:ring-2 focus:ring-black outline-none text-sm font-medium"
            />

            {searchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Date Filter */}
          <div className="relative flex-shrink-0">
            <input
              type="date"
              aria-label="Filter transactions by date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-zinc-50 border-none rounded-full px-4 py-2.5 outline-none text-sm font-medium text-zinc-600 focus:ring-2 focus:ring-black cursor-pointer"
            />
            {selectedDate && (
              <button
                type="button"
                aria-label="Clear date filter"
                onClick={() => setSelectedDate("")}
                className="absolute right-9 top-1/2 -translate-y-1/2 bg-zinc-200 rounded-full p-1 text-zinc-600 hover:text-black hover:bg-zinc-300 transition-colors"
              >
                <X size={10} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
        <div className="rounded-3xl border border-zinc-100 overflow-auto max-h-screen h-full">
          {isLoading && (
            <div className="flex flex-col gap-3 items-center justify-center h-48 text-zinc-500 font-medium">
              <Loader2 className="animate-spin" size={36} />
              Loading transactions...
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-48 text-red-500">
              Failed to load transactions.
            </div>
          )}
          {/* <div className="w-full overflow-x-auto"> */}
          {!isLoading && !error && (
            <table className="w-full min-w-max text-left border-collapse">
              <thead className="bg-[#F4E6CB] sticky top-0 z-10">
                <tr>
                  <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">
                    Transaction ID
                  </th>
                  <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">
                    Date
                  </th>
                  <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">
                    Time
                  </th>
                  <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">
                    Items
                  </th>
                  <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">
                    Total
                  </th>
                  <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap">
                    Payment
                  </th>
                  <th className="p-3 font-bold text-zinc-900 text-sm whitespace-nowrap text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-zinc-50/50 group transition-colors"
                  >
                    <td className="p-2 font-medium text-zinc-600 text-sm align-top">
                      #{transaction._id}
                    </td>
                    <td className="p-2 align-top">
                      <div className="text-zinc-600 font-medium text-sm">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
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
                          <div
                            key={i}
                            className="flex items-center justify-between border-b border-zinc-100 last:border-0 pb-2 last:pb-0 gap-2"
                          >
                            <span className="font-medium text-zinc-900 text-sm line-clamp-2 capitalize">
                              {item.name}
                            </span>
                            <span className="text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md font-mono text-xs font-bold whitespace-nowrap flex-shrink-0">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                        {transaction.items.length === 0 && (
                          <span className="text-zinc-400 italic text-sm">
                            No items
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 font-bold text-zinc-900 text-sm align-top">
                      ₦{formatCurrency(transaction.total)}
                    </td>
                    <td className="p-2 align-top">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                          transaction.payment === "cash"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : transaction.payment === "card"
                              ? "bg-blue-50 text-blue-700 border-blue-100 whitespace-nowrap"
                              : "bg-purple-50 text-purple-700 border-purple-100"
                        }`}
                      >
                        {transaction.payment === "cash" && (
                          <Banknote size={12} />
                        )}
                        {transaction.payment === "card" && (
                          <CreditCard size={12} />
                        )}
                        {transaction.payment === "transfer" && (
                          <ArrowRightLeft size={12} />
                        )}
                        {transaction.payment}
                      </div>
                    </td>
                    <td className="p-2 text-right align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenModal("edit", transaction)}
                          className="p-2 text-zinc-500 bg-zinc-100 hover:bg-black hover:text-white rounded-full transition-all"
                          title="Edit Transaction"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenModal("delete", transaction)}
                          className="p-2 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-full transition-all"
                          title="Delete Transaction"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* </div> */}

          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
              <Package size={48} className="mb-4 opacity-20" />
              <p>
                {selectedDate
                  ? "No transactions found for this date."
                  : "No transactions found."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {modalState.isOpen &&
        (modalState.transaction || modalState.type === "clear-all") && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden p-4 md:p-8 relative">
              <button
                type="button"
                aria-label="Close modal"
                onClick={handleCloseModal}
                className="absolute top-6 right-6 p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    modalState.type === "delete" ||
                    modalState.type === "clear-all"
                      ? "bg-red-50 text-red-500"
                      : "bg-zinc-100 text-zinc-900"
                  }`}
                >
                  {modalState.type === "delete" ||
                  modalState.type === "clear-all" ? (
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
              {modalState.type === "edit" &&
                modalState.transaction &&
                editSale && (
                  <div className="bg-zinc-50 rounded-xl p-2 md:p-4 mb-6 border border-zinc-100 space-y-4">
                    {editSale.items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-5 items-center gap-3 w-full"
                      >
                        <input
                          className="col-span-2 px-3 py-2 rounded-lg border text-sm"
                          value={item.name}
                          onChange={(e) => {
                            const updated = [...editSale.items];
                            updated[index].name = e.target.value;
                            setEditSale({ ...editSale, items: updated });
                          }}
                        />

                        <input
                          type="number"
                          className="px-3 py-2 rounded-lg border text-sm"
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...editSale.items];
                            updated[index].quantity = Number(e.target.value);
                            setEditSale({ ...editSale, items: updated });
                          }}
                        />

                        <div className="col-span-2 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">
                            ₦
                          </span>
                          <input
                            type="number"
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
                    ))}

                    <div>
                      <label className="text-sm text-zinc-500">
                        Payment Method
                      </label>
                      <select
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                        value={editSale?.payment ?? ""}
                        onChange={(e) =>
                          setEditSale((prev) => ({
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
                  onClick={handleCloseModal}
                  className="flex-1 py-3.5 rounded-xl font-bold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] ${
                    modalState.type === "delete" ||
                    modalState.type === "clear-all"
                      ? "bg-red-500 shadow-red-500/20 hover:bg-red-600"
                      : "bg-black shadow-zinc-900/10 hover:bg-zinc-800"
                  }`}
                >
                  {modalState.type === "delete" ||
                  modalState.type === "clear-all"
                    ? "Confirm Delete"
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default SalesHistoryView;
