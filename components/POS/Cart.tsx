import React, { useState } from 'react';
import { Trash2, Minus, Plus, CreditCard, Banknote, Smartphone, X, ChevronRight, Package, Smartphone as PhoneIcon, Shirt, Coffee, Home, Sparkles, ArrowLeft, CheckCircle2, ArrowRightLeft, Printer, Download } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Transaction } from '../../types';

// Helper for icons (duplicate simple logic or import if shared)
const getCategoryIcon = (category: string) => {
    switch(category) {
        case 'Electronics': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: <PhoneIcon size={20} /> };
        case 'Clothing': return { bg: 'bg-purple-50', text: 'text-purple-600', icon: <Shirt size={20} /> };
        case 'Groceries': return { bg: 'bg-green-50', text: 'text-green-600', icon: <Coffee size={20} /> };
        case 'Home': return { bg: 'bg-orange-50', text: 'text-orange-600', icon: <Home size={20} /> };
        case 'Beauty': return { bg: 'bg-pink-50', text: 'text-pink-600', icon: <Sparkles size={20} /> };
        default: return { bg: 'bg-zinc-50', text: 'text-zinc-600', icon: <Package size={20} /> };
    }
}

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, completeSale } = useStore();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'confirm'>('method');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Cash' | 'Debit Card' | 'Transfer' | null>(null);
  
  // Receipt State
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal;

  const handleMethodSelect = (method: 'Cash' | 'Debit Card' | 'Transfer') => {
    setSelectedPaymentMethod(method);
    setPaymentStep('confirm');
  };

  const handleFinalizePayment = () => {
    if (selectedPaymentMethod) {
      const transaction = completeSale(selectedPaymentMethod, undefined);
      setLastTransaction(transaction);
      setShowPayment(false);
      setPaymentStep('method');
      setSelectedPaymentMethod(null);
      setShowReceipt(true);
    }
  };

  const handleClosePayment = () => {
      setShowPayment(false);
      // Reset state after animation
      setTimeout(() => {
        setPaymentStep('method');
        setSelectedPaymentMethod(null);
      }, 200);
  }

  const handleCloseReceipt = () => {
      setShowReceipt(false);
      setLastTransaction(null);
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden relative">
      {/* Cart Header */}
      <div className="p-6 pb-4 border-b border-zinc-50">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Current Order</h2>
            <button onClick={clearCart} className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1 bg-red-50 rounded-lg transition-colors">
                Clear
            </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-300">
            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
                <Smartphone size={32} className="opacity-50" />
            </div>
            <p className="font-medium text-zinc-400">Cart is empty</p>
            <p className="text-sm text-zinc-300 mt-1">Start adding products</p>
          </div>
        ) : (
          cart.map((item) => {
            const styles = getCategoryIcon(item.category);
            return (
                <div key={item.cartId} className="flex gap-3 bg-white p-2 rounded-2xl group hover:bg-zinc-50 transition-colors">
                <div className={`w-14 h-14 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center flex-shrink-0`}>
                    {styles.icon}
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-zinc-800 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-zinc-500 font-medium">₦{item.price.toFixed(2)}</p>
                </div>
                
                <div className="flex flex-col items-end justify-between py-1">
                    <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-0.5">
                    <button 
                        onClick={() => updateCartQuantity(item.cartId, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-zinc-600 shadow-sm hover:text-black"
                    >
                        <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                    <button 
                        onClick={() => updateCartQuantity(item.cartId, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-zinc-600 shadow-sm hover:text-black"
                    >
                        <Plus size={12} />
                    </button>
                    </div>
                    <button 
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-red-300 hover:text-red-500 p-1 transition-colors"
                    >
                    <Trash2 size={14} />
                    </button>
                </div>
                </div>
            );
          })
        )}
      </div>

      {/* Totals & Actions */}
      <div className="p-6 bg-zinc-50/50 border-t border-zinc-100 backdrop-blur-sm">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-zinc-500 text-sm font-medium">
            <span>Subtotal</span>
            <span className="text-zinc-800">₦{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-zinc-200">
            <span className="text-zinc-500 font-medium">Total</span>
            <span className="text-3xl font-bold text-black tracking-tight">₦{total.toFixed(2)}</span>
          </div>
        </div>

        <button 
        disabled={cart.length === 0}
        onClick={() => setShowPayment(true)}
        className="w-full py-4 bg-[#111] text-white rounded-full font-bold text-lg shadow-xl shadow-zinc-900/10 hover:shadow-zinc-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            Checkout
            <ChevronRight size={20} className="opacity-60" />
        </button>
      </div>

      {/* Payment & Confirmation Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-[#111]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden p-6 relative">
            <button onClick={handleClosePayment} className="absolute top-6 right-6 p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors z-10">
                <X size={20} />
            </button>

            {paymentStep === 'method' ? (
                <>
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-zinc-900">Payment Method</h3>
                        <p className="text-zinc-500 mt-1">Choose how you want to pay</p>
                    </div>
                    
                    <div className="space-y-3">
                    <PaymentOption 
                        icon={<Banknote size={24} />} 
                        title="Cash" 
                        subtitle="Pay with physical cash"
                        onClick={() => handleMethodSelect('Cash')}
                        color="bg-[#E9F5E9] text-green-700"
                    />
                    <PaymentOption 
                        icon={<CreditCard size={24} />} 
                        title="Debit Card" 
                        subtitle="Visa, Mastercard, Verve"
                        onClick={() => handleMethodSelect('Debit Card')}
                        color="bg-[#E6F0FF] text-blue-700"
                    />
                    <PaymentOption 
                        icon={<ArrowRightLeft size={24} />} 
                        title="Transfer" 
                        subtitle="Bank transfer / USSD"
                        onClick={() => handleMethodSelect('Transfer')}
                        color="bg-[#F3E6FF] text-purple-700"
                    />
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-6">
                        <button onClick={() => setPaymentStep('method')} className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors mb-4 text-sm font-semibold">
                            <ArrowLeft size={16} /> Back
                        </button>
                        <h3 className="text-2xl font-bold text-zinc-900">Confirm Payment</h3>
                        <p className="text-zinc-500 mt-1">Please review the transaction</p>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-6 mb-6 text-center border border-zinc-100">
                         <p className="text-zinc-500 text-sm font-medium mb-1">Total Amount</p>
                         <div className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">₦{total.toFixed(2)}</div>
                         
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-full shadow-sm">
                             {selectedPaymentMethod === 'Cash' && <Banknote size={16} className="text-green-600" />}
                             {selectedPaymentMethod === 'Debit Card' && <CreditCard size={16} className="text-blue-600" />}
                             {selectedPaymentMethod === 'Transfer' && <ArrowRightLeft size={16} className="text-purple-600" />}
                             <span className="text-sm font-bold text-zinc-700">{selectedPaymentMethod} Payment</span>
                         </div>
                    </div>

                    <div className="space-y-3 mb-6">
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-zinc-500">Items Count</span>
                             <span className="font-semibold text-zinc-900">{cart.reduce((a, b) => a + b.quantity, 0)} items</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-zinc-500">Subtotal</span>
                             <span className="font-semibold text-zinc-900">₦{subtotal.toFixed(2)}</span>
                         </div>
                    </div>

                    <button 
                        onClick={handleFinalizePayment}
                        className="w-full py-4 bg-[#111] text-white rounded-xl font-bold text-lg shadow-xl shadow-zinc-900/10 hover:shadow-zinc-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 size={20} />
                        Confirm & Print Receipt
                    </button>
                </>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Receipt Content - Scrollable */}
                <div className="p-8 overflow-y-auto bg-white text-zinc-800 font-mono text-sm leading-relaxed" id="receipt-content">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Apex POS</h2>
                        <p className="text-xs text-zinc-500">123 Commerce St, Business City</p>
                        <p className="text-xs text-zinc-500">Tel: +1 234 567 890</p>
                    </div>
                    
                    <div className="border-b-2 border-dashed border-zinc-200 my-4"></div>
                    
                    <div className="flex justify-between text-xs mb-1">
                        <span>Date: {new Date(lastTransaction.timestamp).toLocaleDateString()}</span>
                        <span>Time: {new Date(lastTransaction.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                        <span>Trans ID:</span>
                        <span>#{lastTransaction.id}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span>Cashier:</span>
                        <span>{lastTransaction.cashierId}</span>
                    </div>

                    <div className="border-b-2 border-dashed border-zinc-200 my-4"></div>

                    <div className="space-y-3">
                        {lastTransaction.items.map((item, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="font-bold">{item.name}</span>
                                <div className="flex justify-between pl-4 text-zinc-500">
                                    <span>{item.quantity} x {item.price.toFixed(2)}</span>
                                    <span className="text-zinc-800 font-semibold">{ (item.quantity * item.price).toFixed(2) }</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-b-2 border-dashed border-zinc-200 my-4"></div>

                    <div className="space-y-1 text-base">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₦{lastTransaction.subtotal.toFixed(2)}</span>
                        </div>
                        {lastTransaction.discount > 0 && (
                            <div className="flex justify-between text-red-500">
                                <span>Discount</span>
                                <span>-₦{lastTransaction.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-xl mt-2">
                            <span>TOTAL</span>
                            <span>₦{lastTransaction.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-b-2 border-dashed border-zinc-200 my-4"></div>

                    <div className="text-center space-y-2">
                        <div className="flex justify-center items-center gap-2 text-sm font-bold bg-zinc-100 py-1 rounded">
                            <span>Payment: {lastTransaction.paymentMethod}</span>
                        </div>
                        <p className="text-xs mt-4">Thank you for shopping with us!</p>
                        <p className="text-xs">Please keep this receipt for returns.</p>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                        <div className="w-48 h-12 bg-zinc-100 rounded flex items-center justify-center">
                            {/* Barcode simulation */}
                            <div className="flex gap-1 h-8 items-center opacity-50">
                                {[...Array(20)].map((_,i) => <div key={i} className={`w-${Math.random() > 0.5 ? '0.5' : '1'} h-full bg-black`}></div>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex gap-3">
                    <button 
                        onClick={handleCloseReceipt}
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
            
            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #receipt-content, #receipt-content * {
                        visibility: visible;
                    }
                    #receipt-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                }
            `}</style>
        </div>
      )}
    </div>
  );
};

const PaymentOption = ({ icon, title, subtitle, onClick, color }: any) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 border border-zinc-100 rounded-2xl hover:border-black/10 hover:shadow-lg transition-all text-left group bg-white">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-zinc-900">{title}</h4>
            <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
        <ChevronRight size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
    </button>
);

export default Cart;