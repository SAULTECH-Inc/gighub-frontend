

import React from 'react';

const ApplicationSettings = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Application Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Resume */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Resume</label>
          <input 
            type="file" 
            className="w-full bg-[#F7F8FA] p-2 border-[1px] border-[#E6E6E6] rounded-[10px] focus:outline-none focus:ring-2"
          />
        </div>

        {/* Upload Cover Letter */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Cover Letter</label>
          <input 
            type="file" 
            className="w-full bg-[#F7F8FA] p-2 border-[1px] border-[#E6E6E6] rounded-[10px] focus:outline-none focus:ring-2"
          />
        </div>

        {/* Portfolio */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Portfolio</label>
          <input 
            type="text" 
            placeholder="Enter your portfolio link" 
            className="w-full bg-[#F7F8FA] p-2 border-[1px] border-[#E6E6E6] rounded-[10px] focus:outline-none focus:ring-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationSettings;
