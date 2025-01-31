const JobOpening = () => {
    const jobListings = [
        {
            title: 'Senior Software Engineer',
            location: 'Full Time - Lagos, Nigeria',
        },
        {
            title: 'Senior Software Engineer',
            location: 'Full Time - Lagos, Nigeria',
        },
        {
            title: 'Senior Software Engineer',
            location: 'Full Time - Lagos, Nigeria',
        },
    ];

    return (
        <section className="bg-white p-6 rounded-lg shadow mt-14 relative">
            <h2 className="text-xl font-semibold mb-4">Current Job Opening</h2>
            <div className="flex space-x-4">
                {jobListings.map((job, index) => (
                    <div key={index} className="flex-1 p-6 w-[363px] h-[178px] bg-[#F7F7F7] shadow-sm">
                        <div>
                            <h3 className="font-lato font-semibold">{job.title}</h3>
                            <p className=" font-lato text-sm text-[#7F7F7F]">{job.location}</p>
                        </div>
                        <div className="flex space-x-8 mt-4">
                            <button
                                className="px-6 py-2 bg-[#6B5AED] h-[41px] w-[100px] text-white rounded-[10px] hover:bg-purple-700 transition duration-200">
                                Apply
                            </button>
                            <button
                                className="px-6 py-2 bg-white w-[130px] h-[41px] text-[#000000]   rounded-[10px] transition duration-200">
                                View Detail
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default JobOpening;
