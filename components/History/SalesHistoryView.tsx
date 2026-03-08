import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { SaleRecord } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSale, getSales, updateSale } from "@/api/sales";
import TransactionTable from "./TransactionTable";
import TransactionFilters from "./TransactionFilters";
import TransactionModal from "./TransactionModal";

const SalesHistoryView: React.FC = () => {
  const { clearTransactions } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editSale, setEditSale] = useState<any>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "edit" | "delete" | "clear-all" | "print" | null;
    transaction: SaleRecord | null;
  }>({ isOpen: false, type: null, transaction: null });

  const { data, isLoading, error } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });
  const sales: SaleRecord[] = data?.data?.sales || [];

  const filteredTransactions = sales.filter((t) => {
    const matchesSearch =
      t._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
        return { ...old, data: { ...old.data, sales: old.data.sales.map((sale: any) => sale._id === id ? { ...sale, ...data } : sale) } };
      });
      return { previousSales };
    },
    onError: (_err, _vars, context) => {
      console.error("Update failed:", _err);
      queryClient.setQueryData(["sales"], context?.previousSales);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });

  const deleteSaleMutation = useMutation({
    mutationFn: (id: string) => deleteSale(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["sales"] });
      const previousSales = queryClient.getQueryData(["sales"]);
      queryClient.setQueryData(["sales"], (old: any) => {
        if (!old) return old;
        return { ...old, data: { ...old.data, sales: old.data.sales.filter((sale: any) => sale._id !== id) } };
      });
      return { previousSales };
    },
    onError: (_err, _vars, context) => {
      console.error("Delete failed:", _err);
      queryClient.setQueryData(["sales"], context?.previousSales);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });

  const handleOpenModal = (
    type: "edit" | "delete" | "clear-all" | "print",
    transaction?: SaleRecord | null,
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
      updateSaleMutation.mutate({ id: modalState.transaction._id, data: editSale });
    }
    if (modalState.type === "clear-all") clearTransactions();
    if (modalState.type === "delete" && modalState.transaction) {
      deleteSaleMutation.mutate(modalState.transaction._id);
    }
    handleCloseModal();
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-[2rem] shadow-sm border border-zinc-100 relative">
      <TransactionFilters
        searchTerm={searchTerm}
        selectedDate={selectedDate}
        onSearchChange={setSearchTerm}
        onDateChange={setSelectedDate}
      />

      <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
        <div className="rounded-3xl border border-zinc-100 overflow-auto h-full">
          <TransactionTable
            sales={filteredTransactions}
            isLoading={isLoading}
            error={error}
            selectedDate={selectedDate}
            onEdit={(t) => handleOpenModal("edit", t)}
            onDelete={(t) => handleOpenModal("delete", t)}
            onPrint={(t) => handleOpenModal("print", t)}
          />
        </div>
      </div>

      <TransactionModal
        modalState={modalState}
        editSale={editSale}
        setEditSale={setEditSale}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default SalesHistoryView;