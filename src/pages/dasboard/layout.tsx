import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Footer } from "./footer/Footer";
import { Sidebar } from "../dasboard/sidebar/Sidebar";
import { ThemeProvider } from "../../providers/ThemeProvider";
import { Navbar } from "../navbar/Navbar";
// import { TanstackProvider } from "../../providers/tanstackProvider";

export default function Layout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <ThemeProvider>
        <div className="flex">
          <Sidebar />

          <Navbar />

          <div className="@container min-h-screen w-full">
            <main className="px-6 pb-12 pt-6 max-md:pt-24">
              <Outlet />
            </main>

            <Footer />
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
      </ThemeProvider>
    </html>
  );
}
