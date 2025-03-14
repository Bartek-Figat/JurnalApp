import {
  ChartNoAxesCombinedIcon,
  CircleHelpIcon,
  DribbbleIcon,
  FacebookIcon,
  GithubIcon,
  HistoryIcon,
  InfoIcon,
  InstagramIcon,
  LayoutDashboardIcon,
  SquareKanbanIcon,
  StickyNoteIcon,
  TwitterIcon,
  UsersIcon,
} from "lucide-react";
import { getValues } from "../helpers/getObjectProperties";

export enum ERouteGroup {
  INFORMATION = "information",
  SOCIAL = "social",
  SIDEBAR = "sidebar",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

export enum ERoute {
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  X = "x",
  GITHUB = "github",
  DRIBBBLE = "dribbble",

  CREATE_TRADE = "create-trade",
  DASHBOARD = "dashboard",
  ANALYTICS = "analytics",
  LIGHTWEIGH = "lightweigh",
  TUTORIALS = "tutorials",
  CHANGELOG = "changelog",
  COMMUNITY_SUPPORT = "community-support",
}

export enum EInfoRoute {
  COOKIES_POLICY = "cookie-policy",
  PRIVACY = "privacy-policy",
  TAC = "tac",
}

export type RouteId = ERoute | EInfoRoute;

export const Routes: Record<RouteId, Route> = {
  [ERoute.FACEBOOK]: {
    id: ERoute.FACEBOOK,
    routeName: "Facebook",
    groups: [ERouteGroup.SOCIAL],
    icon: FacebookIcon,
    link: "",
  },
  [ERoute.INSTAGRAM]: {
    id: ERoute.INSTAGRAM,
    routeName: "Instagram",
    groups: [ERouteGroup.SOCIAL],
    icon: InstagramIcon,
    link: "",
  },
  [ERoute.X]: {
    id: ERoute.X,
    routeName: "X",
    groups: [ERouteGroup.SOCIAL],
    icon: TwitterIcon,
    link: "",
  },
  [ERoute.GITHUB]: {
    id: ERoute.GITHUB,
    routeName: "Github",
    groups: [ERouteGroup.SOCIAL],
    icon: GithubIcon,
    link: "",
  },
  [ERoute.DRIBBBLE]: {
    id: ERoute.DRIBBBLE,
    routeName: "Dribbble",
    groups: [ERouteGroup.SOCIAL],
    icon: DribbbleIcon,
    link: "",
  },

  [EInfoRoute.TAC]: {
    id: EInfoRoute.TAC,
    routeName: "Terms & Conditions",
    groups: [ERouteGroup.INFORMATION],
    icon: CircleHelpIcon,
    link: "",
  },
  [EInfoRoute.PRIVACY]: {
    id: EInfoRoute.PRIVACY,
    routeName: "Privacy Policy",
    groups: [ERouteGroup.INFORMATION],
    icon: CircleHelpIcon,
    link: "",
  },
  [EInfoRoute.COOKIES_POLICY]: {
    id: EInfoRoute.COOKIES_POLICY,
    routeName: "Cookies",
    groups: [ERouteGroup.INFORMATION],
    icon: CircleHelpIcon,
    link: "",
  },

  [ERoute.CREATE_TRADE]: {
    id: ERoute.CREATE_TRADE,
    routeName: "Create Trade",
    groups: [ERouteGroup.SIDEBAR],
    icon: StickyNoteIcon,
    link: "/create-trade",
  },
  [ERoute.DASHBOARD]: {
    id: ERoute.DASHBOARD,
    routeName: "Dashboard",
    groups: [ERouteGroup.SIDEBAR],
    icon: LayoutDashboardIcon,
    link: "/dashboard",
  },
  [ERoute.ANALYTICS]: {
    id: ERoute.ANALYTICS,
    routeName: "Analytics",
    groups: [ERouteGroup.SIDEBAR],
    icon: SquareKanbanIcon,
    link: "/analytics",
  },
  [ERoute.LIGHTWEIGH]: {
    id: ERoute.LIGHTWEIGH,
    routeName: "Lightweigh",
    groups: [ERouteGroup.SIDEBAR],
    icon: ChartNoAxesCombinedIcon,
    link: "/lightweigh",
  },
  [ERoute.TUTORIALS]: {
    id: ERoute.TUTORIALS,
    routeName: "Tutorials",
    groups: [ERouteGroup.SIDEBAR],
    icon: InfoIcon,
    link: "/tutorials",
  },
  [ERoute.CHANGELOG]: {
    id: ERoute.CHANGELOG,
    routeName: "Changelog",
    groups: [ERouteGroup.SIDEBAR],
    icon: HistoryIcon,
    link: "/changelog",
  },
  [ERoute.COMMUNITY_SUPPORT]: {
    id: ERoute.COMMUNITY_SUPPORT,
    routeName: "Community Support",
    groups: [ERouteGroup.SIDEBAR],
    icon: UsersIcon,
    link: "/community-support",
  },
};

export const getRouteLink = (routeId: RouteId | `${RouteId}`) => {
  const route = Routes[routeId];
  if (!route) {
    throw new Error(`Route ${routeId} does not exist`);
  }

  const link = route.link;
  if (!link) {
    throw new Error(`Route ${routeId} does not have a link`);
  }

  return link;
};

export const getRoutesByGroup = (group: ERouteGroup) => {
  return Object.values(Routes).filter((route) => route.groups.includes(group));
};

export const getRoutesByGroups = (groups: ERouteGroup[]) => {
  return Object.values(Routes).filter((route) =>
    route.groups.some((group) => groups.includes(group)),
  );
};

const RoutesByLink = getValues(Routes).reduce(
  (acc, route) => {
    if (route.link) {
      acc[route.link] = route;
    }

    return acc;
  },
  {} as Record<string, Route>,
);

export const getRouteByLink = (link: string): Route | null => {
  return RoutesByLink[link] ?? null;
};

type Icon = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
  }
>;

interface Common {
  id: RouteId;
  groups: ERouteGroup[];
  icon: Icon;
  routeName: string;
}

export type LinkRoute = Common & {
  link: string;
  modal?: never;
  external?: boolean;
};

export type Route = LinkRoute;

export const isLinkRoute = (route: Route): route is LinkRoute => {
  return "link" in route;
};
