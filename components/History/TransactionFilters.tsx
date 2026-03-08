import React from "react";
import { Search, X } from "lucide-react";

interface Props {
  searchTerm: string;
  selectedDate: string;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

const TransactionFilters: React.FC<Props> = ({
  searchTerm,
  selectedDate,
  onSearchChange,
  onDateChange,
}) => {
  return (
    <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-zinc-100 flex-shrink-0">
      <h2 className="text-xl font-bold text-zinc-900 whitespace-nowrap">Recent Transactions</h2>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID or product..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border-none rounded-full focus:ring-2 focus:ring-black outline-none text-sm font-medium"
          />
          {searchTerm && (
            <button type="button" aria-label="Clear search" onClick={() => onSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="relative flex-shrink-0">
          <input
            type="date"
            aria-label="Filter transactions by date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-zinc-50 border-none rounded-full px-4 py-2.5 outline-none text-sm font-medium text-zinc-600 focus:ring-2 focus:ring-black cursor-pointer"
          />
          {selectedDate && (
            <button type="button" aria-label="Clear date filter" onClick={() => onDateChange("")}
              className="absolute right-9 top-1/2 -translate-y-1/2 bg-zinc-200 rounded-full p-1 text-zinc-600 hover:text-black hover:bg-zinc-300 transition-colors">
              <X size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;