import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import SideNav from "./sidebar";
import Navbar from "./navbar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen dark:bg-[#151515]">
      <SideNav />
      <div className="flex-1 overflow-auto">
        <Navbar />
        <div className="mt-[1.25rem]  2xl:mx-[3.3rem] mx-[1.2rem] h-fit">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
