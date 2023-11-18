import AuthLayout from "@/components/AuthLayout";
import RootLayout from "@/components/RootLayout";
import Home from "@/pages/Home";
import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index path="sign-up" element={<Signup />} />
        <Route path="sign-in" element={<Signin />} />
      </Route>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="posts" element={<p>Posts</p>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
