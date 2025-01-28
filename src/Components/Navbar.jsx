import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { FaBell } from "react-icons/fa"; // Import bell icon from react-icons

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    getNotificationCount, 
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-5 font-medium">
        <Link to="/">
          <h1 className="text-md sm:text-xl md:text-2xl lg:text-2xl font-extrabold tracking-widest text-gray-800 uppercase relative text-center leading-tight">
            <span className="font-serif bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
              My Local Bazar
            </span>
            <span className="inline-block text-pink-400 ml-1 md:ml-2 animate-pulse">
              .
            </span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 sm:h-1 w-10 sm:w-14 md:w-16 lg:w-20 bg-pink-300 rounded-full"></div>
          </h1>
        </Link>

        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          <NavLink
            to="/collection"
            className="flex flex-col items-center gap-1"
          >
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt=""
          />

          <div className="group relative">
         <img
              onClick={() => (token ? null : navigate("/login"))}
              src={assets.profile_icon}
              className="w-[6rem] sm:w-4 cursor-pointer"
              alt=""
            />


            {token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer hover:text-black"
                  >
                    My Profiles
                  </p>
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-black"
                  >
                    Orders
                  </p>
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                  <p
                    onClick={() => navigate("/address")}
                    className="cursor-pointer hover:text-black"
                  >
                    Address Book
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <FaBell
              onClick={() => navigate("/notifications")}
              className="text-xl cursor-pointer"
            />
            {getNotificationCount() > 0 && (
              <p className="absolute top-0 right-0 w-4 h-4 text-xs bg-red-600 text-white rounded-full flex items-center justify-center">
                {getNotificationCount()}
              </p>
            )}
          </div>

          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>

          <a
            href="https://adminpanel-63mz.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center px-4 py-2 border rounded-full text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            Admin Panel
          </a>

          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
          />
        </div>
        <div
          className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
            visible ? "w-full" : "w-0"
          }`}
        >
          <div className="flex flex-col text-gray-600">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-3 cursor-pointer"
            >
              <img
                className="h- rotate-180"
                src={assets.dropdown_icon}
                alt=""
              />
              <p>Back</p>
            </div>

            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/collection"
            >
              COLLECTION
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/about"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/contact"
            >
              CONTACT
            </NavLink>
            <a
              href="https://adminpanel-63mz.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/admin"
            >
              Admin Panel
            </a>
          </div>
        </div>
      </div>
      <hr className="w-full border-t border-gray-300 mt-0 " />
    </div>
  );
};

export default Navbar;
