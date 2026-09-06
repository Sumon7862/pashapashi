import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductSection({ products }) {
  const [cat, setCat] = useState("all");
  const [limit, setLimit] = useState(8);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const labels = { grocery: "মুদি", snacks: "নাস্তা" };

  const list = products
    .filter(p => cat === "all" || p.category === cat)
    .slice(0, limit);

  return (
    <div className="max-w-6xl mx-auto mt-6 sm:mt-8 px-3 sm:px-4">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold">জনপ্রিয় পণ্যসমূহ</h2>
        <p className="text-sm text-gray-500 mb-4 sm:mb-6">
          স্থানীয় বিক্রেতাদের তাজা ও বিশ্বস্ত পণ্য
        </p>

        <div className="flex flex-wrap gap-3 justify-between mb-4 sm:mb-6">
          <select onChange={e => setCat(e.target.value)} className="min-w-24 flex-1 sm:flex-none h-10 border px-3 py-1 rounded-md">
            <option value="all">সব</option>
            {categories.map(c => (
              <option key={c} value={c}>{labels[c] || c}</option>
            ))}
          </select>

          <select onChange={e => setLimit(+e.target.value)} className="min-w-24 flex-1 sm:flex-none h-10 border px-3 py-1 rounded-md">
            <option value={4}>৪টি পণ্য</option>
            <option value={8}>৮টি পণ্য</option>
            <option value={12}>১২টি পণ্য</option>
            <option value={16}>১৬টি পণ্য</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {list.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
