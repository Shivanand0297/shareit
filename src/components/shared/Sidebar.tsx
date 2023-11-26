import { useAuthContext } from "@/context/AuthContext";
import { INavLink } from "@/types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutMutation } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { navLinks } from "@/constants";

const Sidebar = () => {
  const navigate = useNavigate();
  const { mutate: handleLogout, isSuccess } = useSignOutMutation();
  const { user } = useAuthContext();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess, navigate]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-4">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo.svg" alt="logo" width={170} height={36} />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-4">
          {navLinks.map((link: INavLink) => (
            <li key={link.label} className={`leftsidebar-link group`}>
              <NavLink
                to={link.route}
                className={({ isActive }) =>
                  `flex gap-4 items-center p-3 rounded-md ${isActive ? "bg-primary-500" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className={`group-hover:invert-white ${isActive ? "invert-white" : ""}`}
                    />
                    {link.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={() => handleLogout()} className="shad-button_ghost p-3">
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default Sidebar;
