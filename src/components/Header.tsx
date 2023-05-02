import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
const Header = () => {
  const user = JSON.parse(localStorage.getItem("socialz-user")!);
  const menuItems = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Add Post",
      path: "/addpost",
    },
    {
      title: "Profile",
      path: `/profile/${user.id}`,
    },
    {
      title: "Explore",
      path: `/explore`,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState<boolean>(false);

  return (
    <div className="p-5 bg-slate-600">
      {!showMenu && (
        <div className="md:flex justify-end hidden -mb-8">
          <CiMenuFries
            size={30}
            color="white"
            className="cursor-pointer"
            onClick={() => setShowMenu(true)}
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-semibold text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          Socialz
        </h1>
        <div className="flex space-x-10 justify-end items-center md:hidden">
          {menuItems.map((item) => {
            return (
              <Link
                to={`${item.path}`}
                key={item.path}
                className={`text-gray-200 ${
                  item.path === location.pathname &&
                  "bg-white text-slate-950 rounded py-1 px-3"
                }`}
                onClick={() => setShowMenu(false)}
              >
                {item.title}
              </Link>
            );
          })}
          <h1
            className="text-gray-200 cursor-pointer"
            onClick={() => {
              localStorage.removeItem("socialz-user");
              navigate("/login");
            }}
          >
            Logout
          </h1>
        </div>
        {showMenu && (
          <div className="md:flex space-x-10 justify-end flex-col items-end space-y-5 hidden">
            {menuItems.map((item) => {
              return (
                <Link
                  to={`${item.path}`}
                  key={item.path}
                  className={`text-gray-200 ${
                    item.path === location.pathname &&
                    "bg-white text-slate-950 rounded py-1 px-3"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
            <h1
              className="text-gray-200"
              onClick={() => {
                localStorage.removeItem("socialz-user");
                navigate("/login");
              }}
            >
              Logout
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
