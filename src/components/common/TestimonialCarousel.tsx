import { useState, useRef, useEffect } from "react";
import testimonials from "../../utils/dummyData.ts";
import { Arrowleft, Arrowright } from "../../assets/icons";

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(3);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Navigate to next testimonial
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  // Navigate to the previous testimonial
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  // Scroll the selected image into view
  useEffect(() => {
    if (imageContainerRef.current) {
      const selectedImage = imageContainerRef.current.children[currentIndex] as HTMLImageElement;
      selectedImage?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }, [currentIndex]);

  // Navigate to specific testimonial by clicking image
  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <>
      <div className="mx-auto">
        <div className="flex items-center justify-between gap-3 mt-14 mb-5">
          <img
            src={Arrowleft}
            alt="back"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={prevTestimonial}
          />

          <div className="flex items-center gap-5 max-md:overflow-x-scroll">
            {testimonials.map((testimonial, index) => (
              <img
                key={testimonial.id}
                src={testimonial.image}
                alt="testimonial image"
                width={70}
                height={70}
                className={`cursor-pointer transition-transform duration-300 ease-in-out ${
                  currentIndex === index ? "scale-110 md:scale-125" : ""
                }`}
                onClick={() => goToTestimonial(index)}
              />
            ))}
          </div>

          <img
            src={Arrowright}
            alt="forward"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={nextTestimonial}
          />
        </div>
        <div className="bg-testimonial bg-contain bg-no-repeat bg-center p-10 md:p-28 flex justify-center items-center">
          <p className="w-[500px] text-white text-center font-lato text-[13px] leading-[19px] font-black m-auto">
            {currentTestimonial.testimonial}
          </p>
        </div>
      </div>
    </>
  );
};

export default TestimonialCarousel;
