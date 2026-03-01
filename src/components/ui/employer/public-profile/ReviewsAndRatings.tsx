import { memo, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Users, Award, ThumbsUp, X } from "lucide-react";
import Rating from "../../../common/Rating.tsx";
import { fetchUserReviews, submitReview } from "../../../../services/api";
import { Review } from "../../../../utils/types";
import { toast } from "react-toastify";

interface ReviewsAndRatingsProps {
  employerId: number;
}

const RatingsAndReviews = memo(({ employerId }: ReviewsAndRatingsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = () => {
    if (!employerId) return;
    setIsLoading(true);
    fetchUserReviews(employerId)
      .then((data) => setReviews(data || []))
      .catch((err) => console.error("Failed to fetch reviews:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, [employerId]);

  const handleSubmitReview = async () => {
    if (reviewRating === 0 || !reviewContent.trim()) {
      toast.error("Please provide both a rating and review content.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitReview({
        content: reviewContent.trim(),
        rating: reviewRating,
        userId: employerId,
      });
      toast.success("Review submitted successfully!");
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewContent("");
      // Refresh reviews
      loadReviews();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return { overallRating: 0, totalReviews: 0, ratingBreakdown: [] };
    }

    const totalReviews = reviews.length;
    const overallRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    // Build breakdown by star count
    const counts = [0, 0, 0, 0, 0]; // index 0=1star, 4=5stars
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star - 1]++;
    });

    const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: counts[stars - 1],
      percentage:
        totalReviews > 0
          ? Math.round((counts[stars - 1] / totalReviews) * 100)
          : 0,
    }));

    return { overallRating, totalReviews, ratingBreakdown };
  }, [reviews]);

  const highlights = [
    { icon: Users, label: "Work Culture", color: "text-blue-600 bg-blue-50" },
    { icon: TrendingUp, label: "Career Growth", color: "text-green-600 bg-green-50" },
    { icon: Award, label: "Benefits", color: "text-purple-600 bg-purple-50" },
    { icon: ThumbsUp, label: "Work-Life Balance", color: "text-orange-600 bg-orange-50" },
  ];

  // Review submission modal
  const ReviewModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900">Write a Review</h3>
          <button
            onClick={() => setShowReviewModal(false)}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Star Rating */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="group transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${star <= reviewRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300 group-hover:text-yellow-300"
                      }`}
                  />
                </button>
              ))}
            </div>
            {reviewRating > 0 && (
              <p className="mt-1 text-sm text-slate-500">
                {reviewRating === 1 && "Poor"}
                {reviewRating === 2 && "Fair"}
                {reviewRating === 3 && "Good"}
                {reviewRating === 4 && "Very Good"}
                {reviewRating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Review Content */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Your Review
            </label>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Share your experience working with this employer..."
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {reviewContent.length}/500
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={() => setShowReviewModal(false)}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || reviewRating === 0 || !reviewContent.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Reviews & Ratings</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-24 rounded-xl bg-slate-100"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 rounded-lg bg-slate-100"></div>
            <div className="h-16 rounded-lg bg-slate-100"></div>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Reviews & Ratings</h2>
        <div className="py-8 text-center">
          <Star className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="mb-4 text-slate-500">No reviews yet</p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700"
          >
            <Star className="h-4 w-4" />
            <span>Be the first to review</span>
          </button>
        </div>
        {showReviewModal && <ReviewModal />}
      </div>
    );
  }

  // Get the 2 most recent reviews
  const recentReviews = [...reviews]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 2);

  const timeAgo = (date: Date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Reviews & Ratings
        </h2>

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
                  {stats.overallRating.toFixed(1)}
                </div>
                <Rating value={Math.round(stats.overallRating)} readOnly />
                <p className="mt-2 text-sm text-slate-600">
                  Based on {stats.totalReviews.toLocaleString()} {stats.totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 space-y-2">
                {stats.ratingBreakdown.map((item) => (
                  <div
                    key={item.stars}
                    className="flex items-center space-x-3 text-sm"
                  >
                    <div className="flex items-center space-x-1">
                      <span className="w-3 text-slate-600">{item.stars}</span>
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
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

                    <span className="w-8 text-right text-slate-600">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Category Ratings - kept as static labels since we don't have per-category data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Categories
            </h3>
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
                      <p className="font-medium text-slate-900">
                        {highlight.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-xl bg-slate-50 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Reviews
              </h3>
            </div>

            <div className="space-y-4">
              {recentReviews.map((review, index) => (
                <div key={index} className="border-l-2 border-slate-200 pl-4">
                  <div className="mb-2 flex items-center space-x-2">
                    <Rating value={review.rating} readOnly />
                    <span className="text-sm text-slate-500">•</span>
                    <span className="text-sm font-medium text-slate-700">
                      {review.authorTitle || review.authorName}
                    </span>
                    <span className="text-sm text-slate-500">•</span>
                    <span className="text-sm text-slate-500">
                      {timeAgo(review.time)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 italic">
                    "{review.content}"
                  </p>
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
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700"
            >
              <Star className="h-4 w-4" />
              <span>Leave a Review</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Review Modal */}
      {showReviewModal && <ReviewModal />}
    </div>
  );
});

RatingsAndReviews.displayName = "RatingsAndReviews";

export default RatingsAndReviews;
