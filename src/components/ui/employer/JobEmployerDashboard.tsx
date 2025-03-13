import React from "react";
import useModalStore from "../../../store/modalStateStores";
import EmployerJobMultistepForm from "../../../pages/employer/EmployerJobMultistepForm";

const JobEmployerDashboard:React.FC = () => {
  const { openModal, isModalOpen } = useModalStore();
  
  // Function to open the job form modal
  const handleAddNewJob = () => {
    openModal('addJobModal');
  };
  
  return (
    <div className="dashboard-container p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <button 
          className="bg-[#6438C2] text-white px-4 py-2 rounded-md hover:bg-[#522da3] transition-colors"
          onClick={handleAddNewJob}
        >
          Add New Job
        </button>
      </div>
      
      {/* Your existing dashboard content here */}
      
      {/* Render the modal only when it should be visible */}
      {isModalOpen('addJobModal') && <EmployerJobMultistepForm />}
    </div>
  );
};

export default JobEmployerDashboard;