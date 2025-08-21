import { motion } from "framer-motion";
import { Star, TrendingUp, Users, Award, ThumbsUp } from "lucide-react";
import Rating from "../../../common/Rating.tsx";

const RatingsAndReviews = () => {
  const overallRating = 4.2;
  const totalReviews = 547;

  const ratingBreakdown = [
    { stars: 5, count: 298, percentage: 54 },
    { stars: 4, count: 164, percentage: 30 },
    { stars: 3, count: 66, percentage: 12 },
    { stars: 2, count: 14, percentage: 3 },
    { stars: 1, count: 5, percentage: 1 },
  ];

  const highlights = [
    {
      icon: Users,
      label: "Work Culture",
      rating: 4.5,
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Career Growth",
      rating: 4.1,
      color: "text-green-600 bg-green-50",
    },
    {
      icon: Award,
      label: "Benefits",
      rating: 4.3,
      color: "text-purple-600 bg-purple-50",
    },
    {
      icon: ThumbsUp,
      label: "Work-Life Balance",
      rating: 3.9,
      color: "text-orange-600 bg-orange-50",
    },
  ];

  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Reviews & Ratings</h2>

        <div className="space-y-6">
          {/* Overall Rating Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl bg-slate-50 p-6"
          >
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
              {/* Rating Display */}
              <div className="text-center sm:text-left">
                <div className="mb-2 text-4xl font-bold text-slate-900">
                  {overallRating.toFixed(1)}
                </div>
                <Rating value={Math.round(overallRating)} readOnly />
                <p className="mt-2 text-sm text-slate-600">
                  Based on {totalReviews.toLocaleString()}+ employee reviews
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 space-y-2">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="w-3 text-slate-600">{item.stars}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    </div>

                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-slate-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                        />
                      </div>
                    </div>

                    <span className="w-8 text-right text-slate-600">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Category Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Rating Breakdown</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((highlight, index) => {
                const IconComponent = highlight.icon;
                return (
                  <motion.div
                    key={highlight.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-4 rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className={`rounded-lg p-2.5 ${highlight.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{highlight.label}</p>
                      <div className="flex items-center space-x-2">
                        <Rating value={Math.round(highlight.rating)} readOnly />
                        <span className="text-sm font-semibold text-slate-700">
                          {highlight.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Reviews Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-xl bg-slate-50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Recent Reviews</h3>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                View All Reviews
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  rating: 5,
                  comment: "Amazing company culture and great opportunities for growth. Highly recommend!",
                  position: "Software Engineer",
                  timeAgo: "2 weeks ago",
                },
                {
                  rating: 4,
                  comment: "Good work-life balance and competitive benefits. Management is supportive.",
                  position: "Product Manager",
                  timeAgo: "1 month ago",
                },
              ].map((review, index) => (
                <div key={index} className="border-l-2 border-slate-200 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Rating value={review.rating} readOnly />
                    <span className="text-sm text-slate-500">•</span>
                    <span className="text-sm font-medium text-slate-700">{review.position}</span>
                    <span className="text-sm text-slate-500">•</span>
                    <span className="text-sm text-slate-500">{review.timeAgo}</span>
                  </div>
                  <p className="text-sm text-slate-700 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center"
          >
            <button className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700">
              <Star className="h-4 w-4" />
              <span>Leave a Review</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RatingsAndReviews;