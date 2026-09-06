import { useSelector } from "react-redux";
import ProductSection from "../components/ProductSection";
import BannerSlider from "../components/BannerSlider";
import { isSupabaseConfigured } from "../lib/supabase";

export default function Home() {
  const { items: products, status, error } = useSelector(s => s.products);

  return (
    <div>
      <BannerSlider />
      {!isSupabaseConfigured && (
        <p className="max-w-6xl mx-auto mt-6 px-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg py-3">
          ডাটাবেস সংযুক্ত নয়। `.env` এ Supabase URL ও anon key বসিয়ে dev সার্ভার রিস্টার্ট করুন।
        </p>
      )}
      {status === "loading" && (
        <p className="text-center text-gray-500 mt-10">পণ্য লোড হচ্ছে...</p>
      )}
      {status === "failed" && (
        <p className="text-center text-red-600 mt-10">{error}</p>
      )}
      {status !== "loading" && <ProductSection products={products} />}
    </div>
  );
}
