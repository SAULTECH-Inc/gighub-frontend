import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import testimonials from "../../utils/dummyData.ts";
import { Arrowleft, Arrowright } from "../../assets/icons";

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(3);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1,
    );
  };

  useEffect(() => {
    if (imageContainerRef.current) {
      const selectedImage = imageContainerRef.current.children[
        currentIndex
      ] as HTMLImageElement;
      selectedImage?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [currentIndex]);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="mx-auto">
      <div className="mt-14 mb-5 flex items-center justify-center gap-20">
        <motion.img
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          src={Arrowleft}
          alt="back"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={prevTestimonial}
        />

        <div
          ref={imageContainerRef}
          className="flex items-center gap-5 max-md:overflow-x-scroll"
        >
          {testimonials.map((testimonial, index) => (
            <motion.img
              key={testimonial.id}
              src={testimonial.image}
              alt="testimonial image"
              width={70}
              height={70}
              onClick={() => goToTestimonial(index)}
              className="cursor-pointer rounded-full"
              animate={{
                scale: currentIndex === index ? 1.5 : 1,
                opacity: currentIndex === index ? 1 : 0.5,
                zIndex: currentIndex === index ? 10 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </div>

        <motion.img
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          src={Arrowright}
          alt="forward"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={nextTestimonial}
        />
      </div>

      <div className="bg-testimonial relative flex items-center justify-center bg-contain bg-center bg-no-repeat p-10 md:p-28">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTestimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="font-lato m-auto w-[500px] text-center text-[13px] leading-[19px] font-black text-white"
          >
            {currentTestimonial.testimonial}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
