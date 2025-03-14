import {
  BellIcon,
  ChevronRight,
  CircleUserIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router";
import SiteLogo from "../dasboard/sidebar/SiteLogo";
import { DarkModeSwitcher } from "../dasboard/sidebar/DarkModeSwitcher";
import {
  ERoute,
  ERouteGroup,
  getRoutesByGroup,
} from "../dasboard/constants/routes";
import { tw } from "../dasboard/helpers/tw";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

const backdropClassName = tw(
  "backdrop-blur-[20px] backdrop-saturate-[160%] border-b border-black/10 bg-background/[82%]",
);

export const Navbar = () => {
  const bottomOpenRef = useRef<SVGAnimateElement | null>(null);
  const bottomCloseRef = useRef<SVGAnimateElement | null>(null);
  const topOpenRef = useRef<SVGAnimateElement | null>(null);
  const topCloseRef = useRef<SVGAnimateElement | null>(null);

  const [isOpen, _setIsOpen] = useState(false);

  const handleAnimation = (isOpen: boolean) => {
    if (
      !bottomCloseRef.current ||
      !topCloseRef.current ||
      !bottomOpenRef.current ||
      !topOpenRef.current
    )
      return;

    if (isOpen) {
      bottomOpenRef.current.beginElement();
      topOpenRef.current.beginElement();
    } else {
      bottomCloseRef.current.beginElement();
      topCloseRef.current.beginElement();
    }
  };

  const setIsOpen = (value: boolean) => {
    _setIsOpen(value);
    handleAnimation(value);
  };

  useScrollLock(isOpen);

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div
        className={tw(
          "group/wrapper relative mx-auto block h-dvh max-h-16 max-w-7xl overflow-hidden transition-all duration-500 has-[input:checked]:max-h-dvh md:hidden",
          backdropClassName,
        )}
      >
        <div
          className={tw(
            "absolute inset-0 -z-10 transition-opacity duration-200",
          )}
          style={{
            backgroundImage: `linear-gradient(
                to bottom,
                var(--theme-color-background) 0%,
                color-mix(in srgb, var(--theme-color-background) 98.7%, transparent) 5%,
                color-mix(in srgb, var(--theme-color-background) 95.1%, transparent) 10.1%,
                color-mix(in srgb, var(--theme-color-background) 89.6%, transparent) 15.3%,
                color-mix(in srgb, var(--theme-color-background) 82.5%, transparent) 20.6%,
                color-mix(in srgb, var(--theme-color-background) 74.1%, transparent) 26.1%,
                color-mix(in srgb, var(--theme-color-background) 64.8%, transparent) 31.9%,
                color-mix(in srgb, var(--theme-color-background) 55%, transparent) 37.9%,
                color-mix(in srgb, var(--theme-color-background) 45%, transparent) 44.2%,
                color-mix(in srgb, var(--theme-color-background) 35.2%, transparent) 50.8%,
                color-mix(in srgb, var(--theme-color-background) 25.9%, transparent) 57.9%,
                color-mix(in srgb, var(--theme-color-background) 17.5%, transparent) 65.3%,
                color-mix(in srgb, var(--theme-color-background) 10.4%, transparent) 73.2%,
                color-mix(in srgb, var(--theme-color-background) 4.9%, transparent) 81.6%,
                color-mix(in srgb, var(--theme-color-background) 1.3%, transparent) 90.5%,
                transparent 100%
            )`,
          }}
        />

        <div className="group peer flex h-16 items-center justify-between gap-5 px-4 drop-shadow-sm">
          <Link
            className="flex flex-col gap-1 transition-opacity duration-300 ease-in-out group-has-[input:checked]:opacity-0"
            to="/"
          >
            <SiteLogo className="text-black dark:text-white" />
          </Link>

          <input
            id="hamburger"
            type="checkbox"
            className="hidden"
            checked={isOpen}
            onChange={() => setIsOpen(!isOpen)}
          />

          <label htmlFor="hamburger">
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              className="cursor-pointer"
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="2 12, 16 12"
              >
                <animate
                  ref={bottomOpenRef}
                  attributeName="points"
                  keyTimes="0;0.5;1"
                  dur="0.24s"
                  begin="indefinite"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
                  values="2 12, 16 12; 2 9, 16 9; 3.5 15, 15 3.5"
                />
                <animate
                  ref={bottomCloseRef}
                  attributeName="points"
                  keyTimes="0;0.5;1"
                  dur="0.24s"
                  begin="indefinite"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
                  values="3.5 15, 15 3.5; 2 9, 16 9; 2 12, 16 12"
                />
              </polyline>

              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="2 5, 16 5"
              >
                <animate
                  ref={topOpenRef}
                  attributeName="points"
                  keyTimes="0;0.5;1"
                  dur="0.24s"
                  begin="indefinite"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
                  values="2 5, 16 5; 2 9, 16 9; 3.5 3.5, 15 15"
                />
                <animate
                  ref={topCloseRef}
                  attributeName="points"
                  keyTimes="0;0.5;1"
                  dur="0.24s"
                  begin="indefinite"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
                  values="3.5 3.5, 15 15; 2 9, 16 9; 2 5, 16 5"
                />
              </polyline>
            </svg>
          </label>
        </div>

        <ul className="group -mt-8 px-12 font-bold">
          <div>
            {getRoutesByGroup(ERouteGroup.SIDEBAR).map(
              ({ routeName, link, icon: Icon, id }, i) => {
                if (id === ERoute.COMMUNITY_SUPPORT) return null;

                return (
                  <li
                    key={routeName}
                    style={
                      {
                        "--in-delay": `${i ** 0.9 * 0.04}s`,
                        "--out-delay": `${
                          (getRoutesByGroup(ERouteGroup.SIDEBAR).length - i) **
                            0.9 *
                          0.05
                        }s`,
                      } as React.CSSProperties
                    } // Type assertion to bypass type checking
                    data-animate-in={isOpen}
                    data-animate-out={!isOpen}
                    className={tw(
                      isOpen ? "animate-fade-in-down" : "animate-fade-out-up",
                      "group/nav opacity-0",
                    )}
                  >
                    <Link
                      to={link}
                      className="text-text flex h-14 cursor-pointer items-center gap-3 py-0.5"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <Icon />

                      <span className="opacity-85 drop-shadow-[0px_2px_13px_var(--theme-color-background)] transition-[opacity,transform] duration-300 ease-out group-hover/nav:translate-x-1 group-hover/nav:opacity-100">
                        {routeName}
                      </span>

                      <ChevronRight className="ease ml-auto scale-75 opacity-0 transition-[opacity,transform] duration-200 group-hover/nav:scale-100 group-hover/nav:opacity-100" />
                    </Link>
                  </li>
                );
              },
            )}
          </div>

          <div className="flex flex-col gap-5">
            <li className="flex gap-3">
              <BellIcon />

              <span>Notifications</span>
            </li>

            <li className="flex gap-3">
              <CircleUserIcon />

              <span>My Account</span>
            </li>

            <hr className="border-border" />

            <li className="flex gap-3">
              <SettingsIcon />

              <span>Settings</span>
            </li>

            <li className="flex gap-3">
              <LogOutIcon />

              <span>Logout</span>
            </li>
            <hr className="border-border" />

            <li className="flex gap-3">
              <MoonIcon />

              <span>Dark Mode</span>

              <DarkModeSwitcher className="ml-auto" />
            </li>
          </div>
        </ul>
      </div>
    </nav>
  );
};

const useScrollLock = (isOpen: boolean) => {
  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);
};
