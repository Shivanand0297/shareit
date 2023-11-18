import { Toaster } from "@/components/ui/toaster";
import "./global.css";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster/>
    </>
  );
};

export default App;
