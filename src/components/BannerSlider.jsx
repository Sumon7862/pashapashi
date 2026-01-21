import Slider from "react-slick";
import { useRef, useState } from "react";
import banners from "../data/banners";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function BannerSlider() {
  const sliderRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // 2 seconds
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrent(newIndex),
    cssEase: "ease-in-out",
  };

  const prevSlide = () => sliderRef.current.slickPrev();
  const nextSlide = () => sliderRef.current.slickNext();
  const goToSlide = (index) => sliderRef.current.slickGoTo(index);

  return (
    <div className="max-w-6xl mx-auto relative mt-20">
      {/* Main Slider */}
      <Slider {...settings} ref={sliderRef}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-2 p-2 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-70 z-10"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-2 p-2 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-70 z-10"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Thumbnails / Circles */}
      <div className="flex justify-center gap-3 mt-3">
        {banners.map((banner, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              idx === current ? "bg-green-500 scale-125" : "bg-gray-300 scale-100"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
