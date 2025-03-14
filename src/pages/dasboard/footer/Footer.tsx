import { Link } from "react-router";
import { ERouteGroup, getRoutesByGroup } from "../constants/routes";

export const Footer = () => {
  return (
    <footer className="py-4.5 text-text border-border bg-background-foreground @max-5xl:flex-col flex w-full items-center gap-4 border-t px-6 text-sm font-bold">
      <span className="@max-5xl:order-3">
        © 2024. TradeKeeper. All rights reserved.
      </span>

      <div className="mx-auto flex items-center justify-center gap-8 max-sm:gap-3">
        {getRoutesByGroup(ERouteGroup.SOCIAL).map(
          ({ id, icon: Icon, link }) => (
            <a
              key={id}
              href={link}
              className="@max-5xl:bg-background @max-5xl:p-3.5 rounded-full"
            >
              <Icon className="size-5" />
            </a>
          ),
        )}
      </div>

      <div className="flex gap-12">
        {getRoutesByGroup(ERouteGroup.INFORMATION).map(
          ({ id, routeName, link }) => (
            <Link key={id} to={link}>
              <span>{routeName}</span>
            </Link>
          ),
        )}
      </div>
    </footer>
  );
};
