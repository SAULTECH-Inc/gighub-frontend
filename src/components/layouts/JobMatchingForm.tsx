
const JobMatchingForm = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full mt-10 mx-auto">
      <h2 className="text-lg font-semibold mb-4">Job Matching Criteria</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Job Title</label>
            <input type="text" className="w-full bg-[#F7F8FA] p-2 border-[1px] border-[#E6E6E6] rounded-[10px] " />
          </div>
          <div>
            <label className="block text-gray-700">Job Type</label>
            <input type="text" className="w-full bg-[#F7F8FA] p-2 border-[1px] border-[#E6E6E6] rounded-[10px]" placeholder="Enter job type" />
          </div>
          <div>
            <label className="block text-gray-700">Salary Range</label>
            <div className="flex gap-2">
              <input type="text" className="w-1/2 bg-[#F7F8FA] p-2 border-[1px] border-[#E6E6E6] rounded-[10px]" placeholder="Minimum" />
              <input type="text" className="w-1/2 bg-[#F7F8FA] p-2 border-[1px] border-[#E6E6E6] rounded-[10px]" placeholder="Maximum" />
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-700">Country</label>
              <input type="text" className="w-full p-2 bg-[#F7F8FA] marker:border-[1px] border-[#E6E6E6] rounded-[10px]" placeholder="Enter country" />
            </div>
            <div>
              <label className="block text-gray-700">City</label>
              <input type="text" className="w-full p-2 bg-[#F7F8FA]  border-[1px] border-[#E6E6E6] rounded-[10px]" placeholder="Enter city" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Industry/Category</label>
            <input type="text" className="w-full p-2 bg-[#F7F8FA]  border-[1px] border-[#E6E6E6] rounded-[10px]" placeholder="Enter industry/category" />
          </div>
          <div>
            <label className="block text-gray-700">Experience Level</label>
            <input type="text" className="w-full p-2 bg-[#F7F8FA] border-[1px] border-[#E6E6E6] rounded-[10px]" placeholder="Enter experience level" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatchingForm;
