import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useDarkMode } from "../../../../theme/useDarkMode";
import useAuthStore from "../../../../authStore/store";
import { PATHS } from "../../../../router";
import ConfirmModal from "../../../elements/modals/confirmModal";

const sideBarData = [
  {
    link: "/dashboard",
    label: "Dashboard",
    icon: "/menu.svg",
    icon2: "/icons/sidebar/dark/trade.svg",
  },
  {
    link: "/dashboard/my-performance",
    label: "My Performance",
    icon: "/icons/sidebar/light/my-performance.svg",
    icon2: "/icons/sidebar/dark/my-performance.svg",
  },
  {
    link: "/dashboard/my-interviews",
    label: "My Interviews",
    icon: "/icons/sidebar/light/my-interviews.svg",
    icon2: "/icons/sidebar/dark/my-interviews.svg",
  },
  {
    link: "/dashboard/academy",
    label: "Academy",
    icon: "/icons/sidebar/light/academy.svg",
    icon2: "/icons/sidebar/dark/academy.svg",
  },
  {
    link: "/dashboard/purchase-and-payment",
    label: "Payment & purchases",
    icon: "/icons/sidebar/light/pay-and-purchase.svg",
    icon2: "/icons/sidebar/dark/pay-and-purchase.svg",
  },
  {
    link: "/dashboard/referral-and-earnings",
    label: "Referral & earnings",
    icon: "/icons/sidebar/light/referral.svg",
    icon2: "/icons/sidebar/dark/referral.svg",
  },
];
const SideNav = () => {
  const location = useLocation();
  const currentUrl = location.pathname;
  const { isDarkMode } = useDarkMode();
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleItemHover = (index: number, isEnter: boolean) => {
    gsap.to(`.sidebar-item-${index}`, {
      x: isEnter ? 8 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const handleLogout = () => {
    useAuthStore.persist.clearStorage();
    navigate(PATHS.login);
  };
  return (
    <>
      {logoutModal && (
        <ConfirmModal
          confirmModalPopUp={logoutModal}
          setConfirmModalPopUp={setLogoutModal}
          confirmMessage={"Are you sure you want to logout?"}
          confirmFunction={handleLogout}
        />
      )}
      <div className="flex flex-col h-full dark:bg-black w-[14.30435rem] 2xl:w-[13rem] border-r border-[#212325]">
        <div
          ref={sidebarRef}
          className="flex-1 overflow-y-auto w-[90%] mx-auto"
        >
          <div
            className="h-[1.89952rem] w-auto mt-[1.67rem] cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={
                isDarkMode
                  ? "/icons/darkMode/fullLogo.svg"
                  : "/icons/lightMode/fullLogo.svg"
              }
              className="w-full h-full"
              alt="Logo"
            />
          </div>
          <nav className="mt-[3.8rem]">
            <ul className="text-white">
              {sideBarData.map((item, index) => (
                <li
                  className="h-[48px]"
                  key={index}
                  onClick={() => navigate(item.link)}
                  onMouseEnter={() => handleItemHover(index, true)}
                  onMouseLeave={() => handleItemHover(index, false)}
                >
                  <div
                    className={`sidebar-item sidebar-item-${index} h-[48px] py-2 m-[10px] rounded-full flex gap-[10px] items-center px-1 dark:hover:bg-gray-800 dark:hover:text-white hover:border-[#00B152] hover:border-2 ${
                      "/" +
                        location.pathname.split("/").splice(1, 2).join("/") ==
                      item.link
                        ? "bg-white text-gray-800 border-[#00B152] border-2 "
                        : "dark:text-white text-black"
                    } cursor-pointer`}
                  >
                    <img
                      src={
                        currentUrl == item.link
                          ? isDarkMode
                            ? item.icon
                            : item.icon
                          : isDarkMode
                          ? item.icon2
                          : item.icon
                      }
                      alt="icon"
                    />
                    <span className="text-[0.69565rem]">{item.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div
          className="p-4 flex gap-2 dark:text-[#E1E1E1] text-[0.69565rem] cursor-pointer"
          onClick={() => {
            setLogoutModal(true);
          }}
        >
          <div>
            <img
              src={
                isDarkMode
                  ? "/icons/darkMode/logout.svg"
                  : "/icons/lightMode/logout.svg"
              }
              alt="logo"
            />
          </div>
          <div>Logout</div>
        </div>
      </div>
    </>
  );
};
export default SideNav;
