const JobMatchingForm = () => {
  return (
    <div className="mx-auto mt-10 w-full rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Job Matching Criteria</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Job Title</label>
            <input
              type="text"
              className="w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Job Type</label>
            <input
              type="text"
              className="w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2"
              placeholder="Enter job type"
            />
          </div>
          <div>
            <label className="block text-gray-700">Salary Range</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="w-1/2 rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2"
                placeholder="Minimum"
              />
              <input
                type="text"
                className="w-1/2 rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2"
                placeholder="Maximum"
              />
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                className="w-full rounded-[10px] border-[#E6E6E6] bg-[#F7F8FA] p-2 marker:border-[1px]"
                placeholder="Enter country"
              />
            </div>
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                className="w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2"
                placeholder="Enter city"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Industry/Category</label>
            <input
              type="text"
              className="w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2"
              placeholder="Enter industry/category"
            />
          </div>
          <div>
            <label className="block text-gray-700">Experience Level</label>
            <input
              type="text"
              className="w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2"
              placeholder="Enter experience level"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatchingForm;
