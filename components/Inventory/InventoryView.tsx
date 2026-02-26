import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import {
  Search,
  AlertTriangle,
  PackageCheck,
  Pencil,
  Save,
  X,
  Filter,
  Package,
  Smartphone,
  Shirt,
  Coffee,
  Home,
  Sparkles,
  Plus,
} from "lucide-react";
import { Product, ProductCategory } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, getProducts } from "@/api/products";
import { log } from "console";

// Helper for category colors and icons
const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Electronics":
      return {
        bg: "bg-blue-50",
        text: "text-blue-600",
        icon: <Smartphone size={20} />,
      };
    case "Clothing":
      return {
        bg: "bg-purple-50",
        text: "text-purple-600",
        icon: <Shirt size={20} />,
      };
    case "Groceries":
      return {
        bg: "bg-green-50",
        text: "text-green-600",
        icon: <Coffee size={20} />,
      };
    case "Home":
      return {
        bg: "bg-orange-50",
        text: "text-orange-600",
        icon: <Home size={20} />,
      };
    case "Beauty":
      return {
        bg: "bg-pink-50",
        text: "text-pink-600",
        icon: <Sparkles size={20} />,
      };
    default:
      return {
        bg: "bg-zinc-50",
        text: "text-zinc-600",
        icon: <Package size={20} />,
      };
  }
};

const InventoryView: React.FC = () => {
  const { updateProductStock, addProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("Product created");
    },
    onError: (error: any) => {
      console.log(error.message);
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", searchTerm, filter],
    queryFn: () =>
      getProducts({
        page: 1,
        limit: 20,
        search: searchTerm || undefined,
        stockStatus:
          filter === "low"
            ? "lowStock"
            : filter === "out"
              ? "soldOut"
              : undefined,
      }),
  });

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: "Electronics",
    quantity: 0,
    price: 0,
    cost: 0,
    lowStockAlert: 5,
  });

  const products = data?.data?.products || [];

  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setEditValue(product.quantity);
  };

  const saveEdit = (_id: string) => {
    // Use selectedDate for timestamp if available, otherwise undefined (current time)
    const timestamp = selectedDate
      ? new Date(selectedDate).toISOString()
      : undefined;
    updateProductStock(_id, editValue, timestamp);
    setEditingId(null);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku || !newProduct.price) return;

    mutation.mutate({
      name: newProduct.name,
      sku: newProduct.sku,
      category: (newProduct.category as ProductCategory) || "Electronics",
      price: Number(newProduct.price),
      cost: Number(newProduct.cost) || 0,
      quantity: Number(newProduct.quantity) || 0,
      lowStockAlert: Number(newProduct.lowStockAlert) || 5,
    });

    setShowAddModal(false);
    setNewProduct({
      category: "Electronics",
      stock: 0,
      price: 0,
      cost: 0,
      lowStockThreshold: 5,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden relative">
      <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border-none rounded-full focus:ring-2 focus:ring-black outline-none font-medium"
            />
          </div>
          {/* Date Filter Input */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-full bg-zinc-50 border-none rounded-full px-4 outline-none font-medium text-zinc-600 focus:ring-2 focus:ring-black cursor-pointer"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-zinc-200 rounded-full p-1 text-zinc-600 hover:text-black hover:bg-zinc-300 transition-colors"
                title="Clear date"
              >
                <X size={10} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="flex gap-1 bg-zinc-50 p-1 rounded-full flex-shrink-0">
            {[
              { id: "all", label: "All Items" },
              { id: "low", label: "Low Stock" },
              { id: "out", label: "Sold Out" },
            ].map((f: any) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === f.id ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#111] text-white px-3 py-2 rounded-full font-bold shadow-lg shadow-zinc-900/10 hover:shadow-xl transition-all flex-shrink-0 ml-auto md:ml-0"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
        <div className="rounded-3xl border border-zinc-100 overflow-auto max-h-screen h-full">
          <div className="w-full overflow-x-auto">
            <table className="min-w-max w-full text-left border-collapse">
              <thead className="bg-[#F4E6CB] sticky top-0 z-10">
                <tr>
                  <th className="p-3 font-bold text-zinc-900 text-sm">
                    Product
                  </th>
                  <th className="p-3 font-bold text-zinc-900 text-sm">
                    SKU / Last Updated
                  </th>
                  <th className="p-3 font-bold text-zinc-900 text-sm">
                    Category
                  </th>
                  <th className="p-3 font-bold text-zinc-900 text-sm">Price</th>
                  <th className="p-3 font-bold text-zinc-900 text-sm">Stock</th>
                  <th className="p-3 font-bold text-zinc-900 text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {products.map((product) => {
                  const styles = getCategoryStyles(product.category);
                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-zinc-50/50 group transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center`}
                          >
                            {styles.icon}
                          </div>
                          <span className="font-bold text-zinc-800 text-sm max-w-48 block">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-zinc-500 font-mono text-xs font-bold">
                          {product.sku}
                        </div>
                        {product.lastUpdated && (
                          <div className="text-xs text-zinc-400 mt-1">
                            {new Date(product.lastUpdated).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold text-zinc-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-zinc-800 text-sm">
                        ₦{product.price.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        {editingId === product._id ? (
                          <div className="flex items-center justify-center gap-2 bg-white shadow-lg p-1 rounded-full border border-zinc-100 inline-flex">
                            <button
                              onClick={() =>
                                setEditValue(Math.max(0, editValue - 1))
                              }
                              className="w-8 h-8 flex items-center justify-center bg-zinc-100 rounded-full hover:bg-zinc-200 font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) =>
                                setEditValue(
                                  parseInt(e.target.value) ||
                                    product.quantity ||
                                    0,
                                )
                              }
                              className="w-12 text-center border-none outline-none font-bold text-sm"
                            />
                            <button
                              onClick={() => setEditValue(editValue + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-zinc-100 rounded-full hover:bg-zinc-200 font-bold"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`
                                    inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                                    ${
                                      product.quantity === 0
                                        ? "bg-red-100 text-red-800"
                                        : product.quantity <=
                                            product.lowStockAlert
                                          ? "bg-[#FDE047] text-black"
                                          : "bg-green-100 text-green-800"
                                    }
                                `}
                          >
                            {product.quantity}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {editingId === product._id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => saveEdit(product._id)}
                              className="p-2 bg-black text-white rounded-full hover:scale-105 transition-transform"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 bg-zinc-100 text-zinc-500 rounded-full hover:bg-zinc-200"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(product)}
                            className="p-2 text-zinc-300 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
            <PackageCheck size={48} className="mb-4 opacity-20" />
            <p>No products found.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-zinc-900">
                Add New Product
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-zinc-700 ml-1">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. Vintage Leather Jacket"
                  value={newProduct.name || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-zinc-700 ml-1">
                    SKU
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="PROD-001"
                    value={newProduct.sku || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sku: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-zinc-700 ml-1">
                    Category
                  </label>
                  <select
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value as any,
                      })
                    }
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Home">Home</option>
                    <option value="Beauty">Beauty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-zinc-700 ml-1">
                    Price (₦)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-zinc-700 ml-1">
                    Cost (₦)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    value={newProduct.cost}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        cost:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-zinc-700 ml-1">
                    Initial Stock
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        quantity:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-zinc-700 ml-1">
                    Low Stock Alert
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    value={newProduct.lowStockAlert}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        lowStockAlert:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl font-bold bg-[#111] text-white shadow-lg shadow-zinc-900/10 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
