import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { Button } from "../components/Button";
import { tw } from "../helpers/tw";

// Base props shared between link and button variants
interface BaseProps {
  icon: any;
  name: string;
  className?: string;
  render?: () => ReactNode;
}

interface LinkTabProps extends BaseProps {
  type: "link";
  link: string;
  onClick?: never;
}

interface ButtonTabProps extends BaseProps {
  type: "button";
  onClick: () => void;
  link?: never;
}

type SidebarTabProps = LinkTabProps | ButtonTabProps;

export const SidebarTab = ({
  icon,
  name,
  type,
  link,
  className,
  onClick,
  render,
}: SidebarTabProps) => {
  if (type === "link")
    return <LinkTab render={render} icon={icon} name={name} link={link} />;
  if (type === "button")
    return (
      <BaseTab render={render} onClick={onClick} className={tw(className)}>
        <Button
          variant="ghost"
          className="cursor-pointer"
          icon={icon}
          iconClassName="max-lg:!m-0"
        >
          <span className="max-lg:hidden">{name}</span>
        </Button>
      </BaseTab>
    );

  return null;
};

const BaseTab = ({
  children,
  className,
  isActive,
  render,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  render?: () => ReactNode;
  onClick?: () => void;
}) => (
  // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
  <div
    className={tw(
      "hover:bg-primary-foreground flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:text-white max-lg:w-fit",
      isActive && "bg-primary hover:bg-primary/90 text-white",
      className,
    )}
    onClick={onClick}
  >
    {children}

    {render?.()}
  </div>
);

const LinkTab = ({
  icon: Icon,
  link,
  name,
  render,
}: Omit<LinkTabProps, "type">) => {
  return (
    <NavLink to={link} className="max-lg:w-fit">
      {({ isActive }) => (
        <BaseTab isActive={isActive} render={render}>
          <Icon className="size-5" />

          <span className="max-lg:hidden">{name}</span>
        </BaseTab>
      )}
    </NavLink>
  );
};
