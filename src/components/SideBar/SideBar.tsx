import Button from "../common/Button";

const SideBar = () => {
  // Handlers for button actions
  const handleNavigation = (route: string) => {
    console.log(`Navigating to ${route}`); // Replace this with your routing logic
  };

  return (
    <div className="fixed left-0 font-lato top-0 h-full bg-white shadow-lg p-6 w-[270px] rounded-[16px] mt-24 ml-4 space-y-40">
      {/* Navigation buttons */}
      <div className="flex flex-col space-y-0">
        {[
          { label: "Basic Company Information", route: "/" },
          { label: "Contact Information", route: "/" },
          { label: "Branding and visual", route: "/" },
          { label: "Company Overview", route: "/" },
          { label: "Social and professional link", route: "/" },
          { label: "Compliance and verifications", route: "/" },
        ].map((button, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(button.route)}
            className="py-3 px-4 rounded-lg text-[14px] font-lato text-gray-600 hover:text-purple-600 hover:bg-gray-100 transition"
          >
            {button.label}
          </button>
        ))}
      </div>
      <div className="mt-20 flex flex-col space-y-6 ">
        <Button className="py-3 px-5 bg-purple-500 text-white rounded-[16px] hover:bg-purple-600 transition">
          Go To Dashboard
        </Button>
        <Button className="py-3 px-5 bg-purple-500 text-white rounded-[16px] hover:bg-purple-600 transition">
          View Public Profile
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
