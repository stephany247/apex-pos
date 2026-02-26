import { Smartphone, Shirt, Coffee, Home, Sparkles, Package } from "lucide-react";

export const getCategoryStyles = (category: string) => {
    switch (category) {
        case "Electronics":
            return {
                bg: "bg-blue-50",
                text: "text-blue-600",
                icon: Smartphone,
            };
        case "Clothing":
            return {
                bg: "bg-purple-50",
                text: "text-purple-600",
                icon: Shirt,
            };
        case "Groceries":
            return {
                bg: "bg-green-50",
                text: "text-green-600",
                icon: Coffee,
            };
        case "Home":
            return {
                bg: "bg-orange-50",
                text: "text-orange-600",
                icon: Home,
            };
        case "Beauty":
            return {
                bg: "bg-pink-50",
                text: "text-pink-600",
                icon: Sparkles,
            };
        default:
            return {
                bg: "bg-zinc-50",
                text: "text-zinc-600",
                icon: Package,
            };
    }
};


  export const formatCurrency = (value: number) =>
    value.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });