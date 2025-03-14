import {
  BellIcon,
  CircleUserIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
} from "lucide-react";
import { SidebarTab } from "./SidebarTab";
import { useTernaryDarkMode } from "usehooks-ts";
import SiteLogo from "./SiteLogo";
import SiteLogoWithoutText from "./SiteLogoWithoutText";
import { ERouteGroup, getRoutesByGroup } from "../constants/routes";
import { noop } from "../helpers/noop";
import { DarkModeSwitcher } from "./DarkModeSwitcher";

export const Sidebar = () => {
  const { isDarkMode, setTernaryDarkMode } = useTernaryDarkMode();

  return (
    <div className="min-w-19 lg:min-w-65 relative transition-all max-md:hidden">
      <div className="lg:min-w-65 border-border bg-background-foreground fixed flex h-full flex-col justify-between border-r p-6 text-sm font-semibold max-lg:px-4">
        <div className="flex flex-col gap-6">
          <SiteLogo className="hidden h-10 w-full text-black lg:block dark:text-white" />
          <SiteLogoWithoutText className="hidden size-max max-lg:block" />

          <hr className="border-border" />

          <div className="flex flex-col gap-2">
            {getRoutesByGroup(ERouteGroup.SIDEBAR).map(
              ({ routeName: name, ...props }) => (
                <SidebarTab key={props.id} {...props} name={name} type="link" />
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SidebarTab
              name="Notifications"
              icon={BellIcon}
              type="button"
              onClick={noop}
            />
            <SidebarTab
              name="My account"
              icon={CircleUserIcon}
              link="/my-account"
              type="link"
            />
          </div>

          <hr className="border-border" />

          <div className="flex flex-col gap-2">
            <SidebarTab
              name="Settings"
              icon={SettingsIcon}
              link="/settings"
              type="link"
            />
            <SidebarTab
              name="Logout"
              icon={LogOutIcon}
              type="button"
              onClick={noop}
            />
          </div>

          <hr className="border-border" />

          <SidebarTab
            name="Dark Mode"
            icon={MoonIcon}
            type="button"
            onClick={() => setTernaryDarkMode(isDarkMode ? "light" : "dark")}
            render={() => (
              <DarkModeSwitcher className="pointer-events-none ml-auto max-lg:hidden" />
            )}
          />
        </div>
      </div>
    </div>
  );
};
