import ProductSection from "../components/ProductSection";
import BannerSlider from "../components/BannerSlider";

export default function Home({ products }) {
  return (
    <div>
      <BannerSlider />
      <ProductSection products={products} />
    </div>
  );
}
