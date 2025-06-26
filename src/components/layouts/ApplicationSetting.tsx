const ApplicationSettings = () => {
  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Application Settings</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Upload Resume */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Upload Resume
          </label>
          <input
            type="file"
            className="w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2 focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Upload Cover Letter */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Upload Cover Letter
          </label>
          <input
            type="file"
            className="w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2 focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Portfolio */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Portfolio</label>
          <input
            type="text"
            placeholder="Enter your portfolio link"
            className="w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-2 focus:ring-2 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationSettings;
