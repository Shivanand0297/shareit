import { bottomBarnavLinks } from "@/constants";
import { INavLink } from "@/types";
import { NavLink } from "react-router-dom";

const Bottombar = () => {
  return (
    <section className="bottom-bar">
      {bottomBarnavLinks.map((link: INavLink) => (
        <NavLink
          to={link.route}
          className={({ isActive }) =>
            `flex-center flex-col gap-1 p-2 transition rounded-md group ${isActive ? "bg-primary-500" : ""}`
          }
          key={`left-sidebar-${link.label}`}
        >
          {({ isActive }) => (
            <>
              <img
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className={`group-hover:invert-white ${isActive ? "invert-white" : ""}`}
              />
              <p className="tiny-medium text-light-2">{link.label}</p>
            </>
          )}
        </NavLink>
      ))}
    </section>
  );
};

export default Bottombar;
