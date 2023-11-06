import { Toaster } from "react-hot-toast";
import "./global.css";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Define default options
          position: "top-right",
          duration: 3000,
          // Default options for specific types
          error: {
            duration: 5000,
          },
        }}
      />
      <AppRoutes />
    </>
  );
};

export default App;
