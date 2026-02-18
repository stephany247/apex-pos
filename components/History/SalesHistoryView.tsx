import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, CreditCard, Banknote, ArrowRightLeft, ChevronRight, Package, X, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Transaction } from '../../types';

const SalesHistoryView: React.FC = () => {
  const { transactions, clearTransactions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Modal State
  const [modalState, setModalState] = useState<{
      isOpen: boolean;
      type: 'edit' | 'delete' | 'clear-all' | null;
      transaction: Transaction | null;
  }>({ isOpen: false, type: null, transaction: null });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by date (YYYY-MM-DD matches the start of ISO string)
    const matchesDate = selectedDate ? t.timestamp.startsWith(selectedDate) : true;
    
    return matchesSearch && matchesDate;
  });

  const handleOpenModal = (type: 'edit' | 'delete' | 'clear-all', transaction?: Transaction | null) => {
      setModalState({ isOpen: true, type, transaction: transaction || null });
  };

  const handleCloseModal = () => {
      setModalState({ isOpen: false, type: null, transaction: null });
  };

  const handleConfirmAction = () => {
      if (modalState.type === 'clear-all') {
          clearTransactions();
      } else if (modalState.type === 'delete' && modalState.transaction) {
          // In a real app, delete specific transaction
          console.log('Delete transaction', modalState.transaction.id);
      }
      handleCloseModal();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden relative">
      <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-zinc-50">
        <h2 className="text-xl font-bold text-zinc-900 hidden md:block">Recent Transactions</h2>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
            {/* Clear All Button */}
            {transactions.length > 0 && (
                <button 
                    onClick={() => handleOpenModal('clear-all')}
                    className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-bold rounded-full border border-red-100 hover:bg-red-100 hover:text-red-700 transition-colors text-sm shadow-sm whitespace-nowrap"
                >
                    <Trash2 size={16} />
                    <span className="hidden md:inline">Clear History</span>
                </button>
            )}

            {/* Date Filter */}
            <div className="relative">
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full md:w-auto bg-zinc-50 border-none rounded-full px-4 py-3 outline-none font-medium text-zinc-600 focus:ring-2 focus:ring-black cursor-pointer"
                />
                {selectedDate && (
                    <button 
                        onClick={() => setSelectedDate('')}
                        className="absolute right-8 top-1/2 -translate-y-1/2 bg-zinc-200 rounded-full p-1 text-zinc-600 hover:text-black hover:bg-zinc-300 transition-colors"
                        title="Clear date"
                    >
                        <X size={10} />
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by ID or product..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border-none rounded-full focus:ring-2 focus:ring-black outline-none font-medium"
                />
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6 custom-scrollbar">
        <div className="rounded-3xl border border-zinc-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#F4E6CB]">
                    <tr>
                        <th className="p-5 font-bold text-zinc-900 text-sm">Transaction ID</th>
                        <th className="p-5 font-bold text-zinc-900 text-sm">Date</th>
                        <th className="p-5 font-bold text-zinc-900 text-sm">Time</th>
                        <th className="p-5 font-bold text-zinc-900 text-sm w-1/3">Items</th>
                        <th className="p-5 font-bold text-zinc-900 text-sm">Total</th>
                        <th className="p-5 font-bold text-zinc-900 text-sm">Payment</th>
                        <th className="p-5 font-bold text-zinc-900 text-sm text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {filteredTransactions.map(transaction => (
                        <tr key={transaction.id} className="hover:bg-zinc-50/50 group transition-colors">
                            <td className="p-5 font-medium text-zinc-600 text-sm align-top">#{transaction.id}</td>
                            <td className="p-5 align-top">
                                <div className="text-zinc-600 font-medium text-sm">
                                    {new Date(transaction.timestamp).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="p-5 align-top">
                                <div className="text-zinc-600 font-medium text-sm">
                                    {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </td>
                            <td className="p-5 align-top">
                                <div className="flex flex-col gap-2">
                                    {transaction.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between border-b border-zinc-100 last:border-0 pb-2 last:pb-0 gap-2">
                                            <span className="font-medium text-zinc-900 text-sm line-clamp-2">{item.name}</span>
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
                            <td className="p-5 font-bold text-zinc-900 text-sm align-top">₦{transaction.total.toFixed(2)}</td>
                            <td className="p-5 align-top">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                    transaction.paymentMethod === 'Cash' ? 'bg-green-50 text-green-700 border-green-100' :
                                    transaction.paymentMethod === 'Debit Card' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    'bg-purple-50 text-purple-700 border-purple-100'
                                }`}>
                                    {transaction.paymentMethod === 'Cash' && <Banknote size={12} />}
                                    {transaction.paymentMethod === 'Debit Card' && <CreditCard size={12} />}
                                    {transaction.paymentMethod === 'Transfer' && <ArrowRightLeft size={12} />}
                                    {transaction.paymentMethod}
                                </div>
                            </td>
                            <td className="p-5 text-right align-top">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => handleOpenModal('edit', transaction)}
                                        className="p-2 text-zinc-500 bg-zinc-100 hover:bg-black hover:text-white rounded-full transition-all"
                                        title="Edit Transaction"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleOpenModal('delete', transaction)}
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
            
            {filteredTransactions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p>{selectedDate ? 'No transactions found for this date.' : 'No transactions found.'}</p>
                </div>
            )}
        </div>
      </div>

      {/* Modal Overlay */}
      {modalState.isOpen && (modalState.transaction || modalState.type === 'clear-all') && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
             <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden p-8 relative">
                <button 
                    onClick={handleCloseModal}
                    className="absolute top-6 right-6 p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                        modalState.type === 'delete' || modalState.type === 'clear-all' ? 'bg-red-50 text-red-500' : 'bg-zinc-100 text-zinc-900'
                    }`}>
                        {modalState.type === 'delete' || modalState.type === 'clear-all' ? <Trash2 size={24} /> : <Pencil size={24} />}
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                        {modalState.type === 'delete' ? 'Delete Transaction' : 
                         modalState.type === 'clear-all' ? 'Clear All History' : 'Edit Transaction'}
                    </h3>
                    <p className="text-zinc-500">
                        {modalState.type === 'delete' 
                            ? `Are you sure you want to remove transaction #${modalState.transaction?.id}? This action cannot be undone.` 
                            : modalState.type === 'clear-all'
                            ? "Are you sure you want to delete ALL transaction history? This action is permanent and cannot be undone."
                            : `Update details for transaction #${modalState.transaction?.id}.`}
                    </p>
                </div>

                {modalState.type === 'edit' && modalState.transaction && (
                    <div className="bg-zinc-50 rounded-xl p-4 mb-6 border border-zinc-100">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-zinc-500">Date</span>
                            <span className="font-semibold">{new Date(modalState.transaction.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-zinc-500">Total Amount</span>
                            <span className="font-semibold">₦{modalState.transaction.total.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-4 italic">
                            Edit form fields would go here...
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
                            modalState.type === 'delete' || modalState.type === 'clear-all'
                            ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600' 
                            : 'bg-black shadow-zinc-900/10 hover:bg-zinc-800'
                        }`}
                    >
                        {modalState.type === 'delete' || modalState.type === 'clear-all' ? 'Confirm Delete' : 'Save Changes'}
                    </button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default SalesHistoryView;