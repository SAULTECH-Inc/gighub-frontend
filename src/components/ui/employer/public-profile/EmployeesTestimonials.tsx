import { memo } from "react";
import { motion } from "framer-motion";
import { Quote, Star, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  initials: string;
  name: string;
  position: string;
  avatar?: string;
  rating: number;
  message: string;
  tenure: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    initials: "MU",
    name: "Maryam Umar",
    position: "Senior Product Designer",
    rating: 5,
    message: "Working at this company has been an amazing experience, with a culture that encourages innovation and personal growth. I'm proud to be part of a team that's transforming the industry landscape.",
    tenure: "2 years",
  },
  {
    id: 2,
    initials: "AB",
    name: "Ahmed Bello",
    position: "Software Engineer",
    rating: 5,
    message: "The collaborative environment and cutting-edge technology stack make this an ideal place for any developer looking to grow their career. The mentorship here is exceptional.",
    tenure: "1.5 years",
  },
  {
    id: 3,
    initials: "FK",
    name: "Fatima Kano",
    position: "Data Scientist",
    rating: 4,
    message: "The company's commitment to work-life balance and professional development is remarkable. I've learned more in my time here than anywhere else in my career.",
    tenure: "3 years",
  },
];

const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center space-x-1">
    {[...Array(5)].map((_, starIndex) => (
      <Star
        key={starIndex}
        className={`h-4 w-4 ${
          starIndex < rating
            ? "text-yellow-400 fill-current"
            : "text-slate-300"
        }`}
      />
    ))}
  </div>
));

StarRating.displayName = 'StarRating';

const TestimonialCard = memo(({ testimonial, index }: { testimonial: Testimonial; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.01 }}
    className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
  >
    {/* Quote Icon */}
    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Quote className="h-8 w-8 text-indigo-600" />
    </div>

    {/* Accent Border */}
    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>

    <div className="flex flex-col space-y-4">
      {/* Header with Employee Info */}
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold shadow-lg">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="h-full w-full rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-sm">{testimonial.initials}</span>
          )}
        </div>

        {/* Employee Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 truncate">{testimonial.name}</h3>
              <p className="text-sm font-medium text-indigo-600 truncate">{testimonial.position}</p>
              <p className="text-xs text-slate-500 mt-1">{testimonial.tenure} at company</p>
            </div>

            {/* Rating */}
            <div className="shrink-0 ml-2">
              <StarRating rating={testimonial.rating} />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Message */}
      <div className="relative">
        <p className="text-slate-700 leading-relaxed italic text-sm sm:text-base">
          "{testimonial.message}"
        </p>
      </div>
    </div>

    {/* Hover Effect */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
  </motion.div>
));

TestimonialCard.displayName = 'TestimonialCard';

const EmployeesTestimonial = memo(() => {
  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Employee Testimonials</h2>
          <p className="text-sm text-slate-500">What our team says</p>
        </div>

        <div className="space-y-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <button className="inline-flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
            <span>View More Testimonials</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
});

EmployeesTestimonial.displayName = 'EmployeesTestimonial';

export default EmployeesTestimonial;