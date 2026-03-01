import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star, ChevronRight, MessageSquare } from "lucide-react";
import { fetchUserReviews } from "../../../../services/api";
import { Review } from "../../../../utils/types";

interface EmployeesTestimonialsProps {
  employerId: number;
}

const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center space-x-1">
    {[...Array(5)].map((_, starIndex) => (
      <Star
        key={starIndex}
        className={`h-4 w-4 ${starIndex < rating ? "fill-current text-yellow-400" : "text-slate-300"
          }`}
      />
    ))}
  </div>
));

StarRating.displayName = "StarRating";

const TestimonialCard = memo(
  ({ review, index }: { review: Review; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 opacity-10 transition-opacity group-hover:opacity-20">
        <Quote className="h-8 w-8 text-indigo-600" />
      </div>

      {/* Accent Border */}
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>

      <div className="flex flex-col space-y-4">
        {/* Header with Employee Info */}
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white shadow-lg">
            {review.authorImage ? (
              <img
                src={review.authorImage}
                alt={review.authorName}
                className="h-full w-full rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-sm">
                {review.authorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>

          {/* Employee Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-slate-900">
                  {review.authorName}
                </h3>
                <p className="truncate text-sm font-medium text-indigo-600">
                  {review.authorTitle}
                </p>
                {review.time && (
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(review.time).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="ml-2 shrink-0">
                <StarRating rating={review.rating} />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Message */}
        <div className="relative">
          <p className="text-sm leading-relaxed text-slate-700 italic sm:text-base">
            "{review.content}"
          </p>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  ),
);

TestimonialCard.displayName = "TestimonialCard";

const EmployeesTestimonial = memo(({ employerId }: EmployeesTestimonialsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!employerId) return;
    setIsLoading(true);
    fetchUserReviews(employerId)
      .then((data) => setReviews(data || []))
      .catch((err) => console.error("Failed to fetch testimonials:", err))
      .finally(() => setIsLoading(false));
  }, [employerId]);

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Employee Testimonials</h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-slate-100 p-6">
              <div className="mb-3 h-4 w-1/3 rounded bg-slate-200"></div>
              <div className="h-3 w-2/3 rounded bg-slate-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Employee Testimonials</h2>
        <div className="py-8 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-slate-500">No testimonials yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Employee Testimonials
          </h2>
          <p className="text-sm text-slate-500">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="space-y-6">
          {reviews.slice(0, 5).map((review, index) => (
            <TestimonialCard
              key={index}
              review={review}
              index={index}
            />
          ))}
        </div>

        {reviews.length > 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <button className="inline-flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none">
              <span>View More Testimonials</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});

EmployeesTestimonial.displayName = "EmployeesTestimonial";

export default EmployeesTestimonial;
