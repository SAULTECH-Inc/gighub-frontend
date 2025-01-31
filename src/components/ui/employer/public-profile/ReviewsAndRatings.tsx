import Rating from "../../../common/Rating.tsx";

const RatingsAndReviews = () => {
    return (
        <section className="bg-gray-100 p-6 rounded-lg shadow mb-12">
            <h2 className="text-xl font-semibold mb-4">Reviews and Ratings</h2>
            <div className=" items-center">
                {/* Rating Stars */}
               <Rating value={5}/>

                {/* Rating Text */}
                <div className="mt-2 text-sm text-[#7F7F7F]">
                    <p>4.5/5 based on 500+ Employee Reviews</p>
                </div>
            </div>
        </section>
    );
};

export default RatingsAndReviews;
