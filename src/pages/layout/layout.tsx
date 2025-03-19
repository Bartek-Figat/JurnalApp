import { Outlet } from "react-router";
import { motion } from "framer-motion";
import { Sidebar } from "../dashboard/sidebar/SideBar";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { Navbar } from "../dashboard/navbar/navbar";

export default function Layout() {
  return (
    <DarkModeProvider>
      <div className="flex h-screen">
        <motion.header
          layoutScroll
          className="contents sm:flex md:fixed md:flex lg:fixed lg:z-40 lg:flex"
        >
          <div className="contents lg:block lg:overflow-y-auto">
            <Sidebar />
            <Navbar />
          </div>
        </motion.header>
        <div className="flex w-full flex-col">
          <main className="md:ml-20 lg:ml-[266px]">
            <Outlet />
          </main>
        </div>
      </div>
    </DarkModeProvider>
  );
}
