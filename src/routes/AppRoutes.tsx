import { Route, Routes } from "react-router-dom";
import { AllUsers, CreatePost, Explore, Home, PostDetails, Posts, ProfileDetails, Saved, Signin, Signup, UpdatePost, UpdateProfile } from "@/pages";

import AuthLayout from "@/components/AuthLayout";
import RootLayout from "@/components/RootLayout";


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
      </Route>

      {/* private routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="posts" element={<Posts/>} />
        <Route path="explore" element={<Explore/>} />
        <Route path="all-users" element={<AllUsers/>} />
        <Route path="saved" element={<Saved/>} />
        <Route path="create-post" element={<CreatePost/>} />
        <Route path="update-post/:id" element={<UpdatePost/>} />
        <Route path="posts/:id" element={<PostDetails/>} />
        <Route path="profile/:id/*" element={<ProfileDetails/>} />
        <Route path="update-profile/:id" element={<UpdateProfile/>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
