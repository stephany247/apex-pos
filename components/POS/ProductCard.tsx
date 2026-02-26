import React from "react";
import { Product } from "@/types";
import { formatCurrency, getCategoryStyles } from "@/utils";
import { Plus } from "lucide-react";

const ProductCard: React.FC<{ product: Product; onAdd: () => void }> = ({
  product,
  onAdd,
}) => {
  const isLowStock = product.quantity <= product.lowStockAlert;
  const isOutOfStock = product.quantity === 0;
  const styles = getCategoryStyles(product.category);
  const Icon = styles.icon;

  return (
    <button
      onClick={onAdd}
      disabled={isOutOfStock}
      className={`
        group relative flex flex-col bg-white rounded-3xl p-3 border border-transparent hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 text-left h-full
        ${isOutOfStock ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl ${styles.bg} ${styles.text} flex items-center justify-center mb-3 transition-colors group-hover:brightness-95`}
      >
        <div className="scale-125 transform transition-transform group-hover:scale-150 duration-300">
          <div className={`${styles.bg} ${styles.text}`}>
            <Icon size={24} />
          </div>
        </div>
        {isLowStock && !isOutOfStock && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#FDE047] text-black text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            Low Stock
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/5 text-black font-bold text-sm backdrop-blur-[1px] rounded-2xl">
            Sold Out
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 px-1">
        <h3 className="font-bold text-zinc-800 leading-snug line-clamp-2 mb-1 group-hover:text-black text-sm">
          {product.name}
        </h3>
        <p className="text-[10px] text-zinc-500 font-mono mb-2">
          {product.sku}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-black break-words leading-tight">
            ₦{formatCurrency(product.price)}
          </span>

          <div className="flex-shrink-0 w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[#FDE047] group-hover:text-black transition-colors shadow-lg shadow-black/10">
            <Plus size={16} className="sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>
    </button>
  );
};
export default ProductCard;
