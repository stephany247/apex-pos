import React from "react";
import { formatCurrency, getCategoryStyles } from "@/utils";
import { Plus } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/context/StoreContext";

const ProductListItem: React.FC<{ product: Product; onAdd: () => void }> = ({
  product,
  onAdd,
}) => {
  const { getCartQty } = useStore();

  const styles = getCategoryStyles(product.category);
  const Icon = styles.icon;

  const isOutOfStock = product.quantity === 0;
  const isMaxedInCart = getCartQty(product._id) >= product.quantity;
  const isDisabled = isOutOfStock || isMaxedInCart;

  return (
    <button
      onClick={!isDisabled ? onAdd : undefined}
      disabled={isDisabled}
      className={`
        w-full flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-3xl
        transition-all text-left group
        ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-200/50"}
      `}
    >
      <div
        className={`w-12 h-12 rounded-2xl ${styles.bg} ${styles.text} flex items-center justify-center`}
      >
        {/* {React.cloneElement(styles.icon as React.ReactElement, { size: 20 })} */}
        <div className={`${styles.bg} ${styles.text}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-zinc-800 text-sm capitalize">{product.name}</h3>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          {product.sku} • Stock: {product.quantity}
        </p>
      </div>
      <span className="text-sm font-bold text-black">
        ₦{formatCurrency(product.price)}
      </span>
      <div
        className={`
        w-8 h-8 rounded-full flex items-center justify-center transition-colors
        ${
          isDisabled
            ? "bg-zinc-200 text-zinc-400"
            : "bg-zinc-100 text-zinc-500 group-hover:bg-black group-hover:text-white"
        }
      `}
      >
        <Plus size={16} />
      </div>
    </button>
  );
};
export default ProductListItem;
