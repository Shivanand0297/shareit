import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import AuthLayout from "@/components/AuthLayout";
import Signup from "@/pages/Signup";
import Signin from "@/pages/Signin";
import RootLayout from "@/components/RootLayout";
import Home from "@/pages/Home";

const AppRoutes = () => {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route element={<AuthLayout />}>
        <Route index path="sign-up" element={<Signup />} />
        <Route path="sign-in" element={<Signin />} />
      </Route>
      <Route element={<RootLayout/>}>
        <Route index element={<Home/>}/>
        <Route path="posts" element={<p>Posts</p>}/>
      </Route>
    </>
    )
  );

  return <RouterProvider router={router} />
}

export default AppRoutes