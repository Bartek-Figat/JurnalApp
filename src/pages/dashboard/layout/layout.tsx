import { Outlet } from "react-router";
import { motion } from "framer-motion";
import { Sidebar } from "../sidebar/SideBar";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";
import { Navbar } from "../navbar/navbar";
import Footer from "../../main/footer";

export default function Layout() {
  return (
    <DarkModeProvider>
      <div className="flex h-full">
        <motion.header
          layoutScroll
          className="contents md:fixed md:flex lg:fixed lg:z-40 lg:flex"
        >
          <div className="contents h-full lg:block lg:overflow-y-auto">
            <Sidebar />
            <Navbar />
          </div>
        </motion.header>
        <div className="flex h-full w-full flex-col justify-center">
          <main className="md:ml-20 lg:ml-64">
            <Outlet />
            <Footer />
          </main>
        </div>
      </div>
    </DarkModeProvider>
  );
}
