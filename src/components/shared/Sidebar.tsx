import { sidebarLinks } from "@/constants";
import { useAuthContext } from "@/context/AuthContext";
import { INavLink } from "@/types";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
  const { user } = useAuthContext();

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo.svg" alt="logo" width={170} height={36} />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.png"}
            alt="profile"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => (
              <li
                key={link.label}
                className={`leftsidebar-link group`}>
                <NavLink
                  to={link.route}
                  className={({ isActive }) => `flex gap-4 items-center p-4 rounded-md ${isActive ? "bg-primary-500" : ""}`}>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
