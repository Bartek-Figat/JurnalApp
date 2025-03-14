import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <div className="mb-2 flex justify-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`h-5 w-5 ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Darrell Steward",
      image: "path/to/image1.jpg", // Replace with actual image path
      text: "Crypto ipsum bitcoin ethereum dogecoin litecoin. Stellar WAX golem dash elrond hedera litecoin. Aave maker velas golem terra amp gala.",
      rating: 5, // Add rating here
    },
    {
      name: "Devon Lane",
      image: "path/to/image2.jpg", // Replace with actual image path
      text: "Crypto ipsum bitcoin ethereum dogecoin litecoin. Kava binance cardano harmony terra quant TRON filecoin secret. Stacks digibyte elrond amp polymath filecoin.",
      rating: 4, // Add rating here
    },
    {
      name: "Guy Hawkins",
      image: "path/to/image3.jpg", // Replace with actual image path
      text: "Crypto ipsum bitcoin ethereum dogecoin litecoin. Avalanche compound stellar secret cardano TRON solana decred audius secret.",
      rating: 3, // Add rating here
    },
    {
      name: "Wade Warren",
      image: "path/to/image4.jpg", // Replace with actual image path
      text: "Crypto ipsum bitcoin ethereum dogecoin litecoin. Hive ox fantom hive XRP algorand harmony kava polymath. Serum audius maker neo celo kusama.",
      rating: 5, // Add rating here
    },
  ];
  return (
    <section className="bg-slate-50 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Here's what our users have to say about us.
          </p>
        </div>
        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="flex h-full transform flex-col rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-blue-500"
                  />
                  <h3 className="text-center text-xl font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <StarRating rating={testimonial.rating} />
                  <p className="mt-2 text-center italic text-gray-600">
                    "{testimonial.text}"
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </ul>
      </div>
    </section>
  );
};

export default Testimonials;
