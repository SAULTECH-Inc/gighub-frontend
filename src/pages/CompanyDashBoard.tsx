// import NavBar from "../components/NavBar/NavBar";
// import SideBar from "../components/SideBar/SideBar";

// function CompanyDashBoard() {
//   return (
//     <>
//       <div className="bg-slate-300">
//         <NavBar />
//         <SideBar />
//       </div>
//     </>
//   );
// }

// export default CompanyDashBoard;

import NavBar from "../components/NavBar/NavBar";
import SideBar from "../components/SideBar/SideBar";

function CompanyDashBoard() {
  return (
    <div className="bg-[#f1f2f3] h-screen flex">
      {/* Sidebar on the left */}
      <SideBar />

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <NavBar />
        <div className="p-6">{/* Add your dashboard content here */}</div>
      </div>
    </div>
  );
}

export default CompanyDashBoard;
