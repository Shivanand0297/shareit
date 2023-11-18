import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <div className="flex justify-between items-center">
          <section className="flex flex-1 justify-center items-center flex-col py-8">
            <Outlet />
          </section>
          <img
            src="/assets/images/auth-img.jpg"
            alt="sign up"
            className="hidden xl:block h-screen w-1/2 object-contain bg-no-repeat"
          />
        </div>
      )}
    </>
  );
};

export default AuthLayout;
