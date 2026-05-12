import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const HomeLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar cartCount={0} />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
