import React, { useState, useMemo } from "react";
import { Search, Grid, List, ScanBarcode } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import Cart from "./Cart";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";
import ProductCard from "./ProductCard";
import ProductListItem from "./ProductListItem";

const POSView: React.FC = () => {
  const { addToCart } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, error, refetch } = useQuery({
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
              <button
                type="button"
                aria-label="Scan barcode"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full text-zinc-400 hover:text-black hover:shadow-md transition-all"
              >
                <ScanBarcode size={18} />
              </button>
            </div>

            <div className="flex bg-zinc-50 rounded-full p-1 gap-1">
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-full transition-all ${viewMode === "grid" ? "bg-white shadow-md text-black" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                <Grid size={18} />
              </button>
              <button
                type="button"
                aria-label="List view"
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
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
              <div className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin mb-4" />
              <p className="font-medium">Loading products...</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <p className="font-semibold mb-2">Failed to load products</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-black text-white rounded-full text-sm"
              >
                Retry
              </button>
            </div>
          )}
          {!isLoading &&
            !error &&
            filteredProducts.length > 0 &&
            (viewMode === "grid" ? (
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
            ))}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="font-medium">
                {searchTerm
                  ? "No products match your search"
                  : "No products available"}
              </p>
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

export default POSView;
