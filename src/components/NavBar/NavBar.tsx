const NavBar = () => {
  // Handlers for button actions
  const handleNavigation = (route: string) => {
    console.log(`Navigating to ${route}`); // Replace this with your routing logic
  };

  const handleSearchClick = () => {
    console.log("Search icon clicked");
  };

  const handleNotificationsClick = () => {
    console.log("Notifications icon clicked");
  };

  const handleAdClick = () => {
    console.log("Ad icon clicked");
  };

  return (
    <nav className="flex flex-row justify-between items-center p-4 bg-white shadow-md">
      {/* Logo */}
      <div>
        <img
          className="w-[100px] h-[35px]"
          src="/src/assets/icons/gighub-logo.png"
          alt="gighub logo"
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-row space-x-4">
        {[
          { label: "Dashboard", route: "/dashboard" },
          { label: "Manage Applicants", route: "/manage-applicants" },
          { label: "My Network", route: "/my-network" },
          { label: "My Schedule", route: "/my-schedule" },
        ].map((button, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(button.route)}
            className="py-3 px-5 rounded-[10px] text-sm font-lato text-gray hover:bg-gray-200 transition"
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Icons */}
      <div className="flex flex-row space-x-4">
        <img
          className="w-[20px] h-[20px] cursor-pointer"
          src="/src/assets/icons/search-01.png"
          alt="Search"
          onClick={handleSearchClick}
        />
        <img
          className="w-[20px] h-[20px] cursor-pointer"
          src="/src/assets/icons/Component 2.png"
          alt="Notifications"
          onClick={handleNotificationsClick}
        />
        <img
          className="w-[20px] h-[20px] cursor-pointer"
          src="/src/assets/icons/Vector (1).png"
          alt="Ad"
          onClick={handleAdClick}
        />
      </div>

      {/* Profile Section */}
      <div className="flex flex-row items-center space-x-4">
        <button
          onClick={() => handleNavigation("/jumia-africa")}
          className="py-3 px-5 rounded-[10px] text-sm font-lato text-gray hover:bg-gray-200 transition"
        >
          Jumia Africa
        </button>
        <img
          className="w-[28px] h-[28px]"
          src="/src/assets/icons/smiling.svg"
          alt="Profile"
        />
      </div>
    </nav>
  );
};

export default NavBar;
