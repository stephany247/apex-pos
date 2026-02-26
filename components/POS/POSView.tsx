import React, { useState, useMemo } from "react";
import {
  Search,
  Grid,
  List,
  Plus,
  ScanBarcode,
  Filter,
  Package,
  Tag,
  ShoppingBag,
  Smartphone,
  Shirt,
  Coffee,
  Home,
  Sparkles,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Product } from "../../types";
import Cart from "./Cart";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";

const POSView: React.FC = () => {
  const { addToCart } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      getProducts({
        page: 1,
        limit: 100,
      }),
  });

  const products = data?.data?.products || [];
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 overflow-hidden min-w-0">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden relative">
        {/* Search & Filter Header */}
        <div className="p-5 pb-3 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-800 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-zinc-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#111] transition-all placeholder:text-zinc-400 text-zinc-800 font-medium"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full text-zinc-400 hover:text-black hover:shadow-md transition-all">
                <ScanBarcode size={18} />
              </button>
            </div>

            <div className="flex bg-zinc-50 rounded-full p-1 gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-full transition-all ${viewMode === "grid" ? "bg-white shadow-md text-black" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-full transition-all ${viewMode === "list" ? "bg-white shadow-md text-black" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="w-full flex flex-wrap gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
          px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap capitalize transition-all duration-200 border
          ${
            selectedCategory === cat
              ? "bg-[#111] text-white border-transparent"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
          }
        `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid/List */}
        <div className="flex-1 overflow-y-auto p-5 pt-0 custom-scrollbar">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAdd={() => addToCart(product)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <ProductListItem
                  key={product._id}
                  product={product}
                  onAdd={() => addToCart(product)}
                />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="font-medium">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="lg:w-[400px] xl:w-[420px] flex-shrink-0 h-full">
        <Cart />
      </div>
    </div>
  );
};

// Helper for category colors and icons
export const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Electronics":
      return {
        bg: "bg-blue-50",
        text: "text-blue-600",
        icon: <Smartphone size={24} />,
      };
    case "Clothing":
      return {
        bg: "bg-purple-50",
        text: "text-purple-600",
        icon: <Shirt size={24} />,
      };
    case "Groceries":
      return {
        bg: "bg-green-50",
        text: "text-green-600",
        icon: <Coffee size={24} />,
      };
    case "Home":
      return {
        bg: "bg-orange-50",
        text: "text-orange-600",
        icon: <Home size={24} />,
      };
    case "Beauty":
      return {
        bg: "bg-pink-50",
        text: "text-pink-600",
        icon: <Sparkles size={24} />,
      };
    default:
      return {
        bg: "bg-zinc-50",
        text: "text-zinc-600",
        icon: <Package size={24} />,
      };
  }
};

const formatCurrency = (value: number) =>
  value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ProductCard: React.FC<{ product: Product; onAdd: () => void }> = ({
  product,
  onAdd,
}) => {
  const isLowStock = product.quantity <= product.lowStockAlert;
  const isOutOfStock = product.quantity === 0;
  const styles = getCategoryStyles(product.category);

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
          {styles.icon}
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

          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[#FDE047] group-hover:text-black transition-colors shadow-lg shadow-black/10">
            <Plus size={12} />
          </div>
        </div>
      </div>
    </button>
  );
};

const ProductListItem: React.FC<{ product: Product; onAdd: () => void }> = ({
  product,
  onAdd,
}) => {
  const styles = getCategoryStyles(product.category);
  return (
    <button
      onClick={onAdd}
      className="w-full flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-3xl hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-200/50 transition-all text-left group"
    >
      <div
        className={`w-12 h-12 rounded-2xl ${styles.bg} ${styles.text} flex items-center justify-center`}
      >
        {React.cloneElement(styles.icon as React.ReactElement, { size: 20 })}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-zinc-800 text-sm">{product.name}</h3>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          {product.sku} • Stock: {product.quantity}
        </p>
      </div>
      <span className="text-sm font-bold text-black">
        ₦{formatCurrency(product.price)}
      </span>
      <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
        <Plus size={16} />
      </div>
    </button>
  );
};

export default POSView;
