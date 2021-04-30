import Home from "./pages/Home";
import Menu from "./components/Menu";
import ProtectedComponent from "./components/ProtectedComponent";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <ProtectedComponent>
      <ToastContainer />
      <Menu />
      <Home />
    </ProtectedComponent>
  );
};

export default App;
