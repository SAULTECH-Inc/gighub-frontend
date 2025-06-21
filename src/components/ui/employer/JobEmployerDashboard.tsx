import React from "react";
import useModalStore from "../../../store/modalStateStores";

const JobEmployerDashboard: React.FC = () => {
  const { openModal } = useModalStore();

  // Function to open the job form modal
  const handleAddNewJob = () => {
    openModal("addJobModal");
  };

  return (
    <div className="dashboard-container p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <button
          className="rounded-md bg-[#6438C2] px-4 py-2 text-white transition-colors hover:bg-[#522da3]"
          onClick={handleAddNewJob}
        >
          Add New Job
        </button>
      </div>

      {/* Your existing dashboard content here */}

      {/* Render the modal only when it should be visible */}
      {/*{isModalOpen('addJobModal') && <EmployerJobMultistepForm />}*/}
    </div>
  );
};

export default JobEmployerDashboard;
