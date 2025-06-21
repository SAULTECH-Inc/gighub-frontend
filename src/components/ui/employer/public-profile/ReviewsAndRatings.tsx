import Rating from "../../../common/Rating.tsx";

const RatingsAndReviews = () => {
  return (
    <section className="bg-gray-100 w-full rounded-lg p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Reviews and Ratings</h2>
      <div className="items-center">
        {/* Rating Stars */}
        <Rating value={4} />

        {/* Rating Text */}
        <div className="mt-2 text-sm text-[#7F7F7F]">
          <p>4/5 based on 500+ Employee Reviews</p>
        </div>
      </div>
    </section>
  );
};

export default RatingsAndReviews;
