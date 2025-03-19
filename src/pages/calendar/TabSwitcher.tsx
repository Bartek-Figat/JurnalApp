import { motion } from "framer-motion";
import { type ComponentProps, type ReactNode, useCallback } from "react";
import { tw } from "../../helpers/tw";

export type Icon = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
  }
>;

export type Tab<E extends string | number> = {
  value: E;
  text: string | ((value: E) => string);
  icon?: Icon;
  iconProps?: ComponentProps<Icon>;
  onHover?: () => void;
  disabledReason?: string | ReactNode;
};

type TabSwitcherProps<E extends string | number> = {
  tabs: Tab<E>[];
  currentTab: E;
  layoutId: string;
  tabOnClick: (value: E) => void;
  tabProps?: React.HTMLAttributes<HTMLButtonElement>;
  iconProps?: ComponentProps<Icon>;
  wrapperClassName?: string;
};

export const TabSwitcher = <E extends string | number>({
  layoutId,
  tabs,
  currentTab,
  tabProps,
  tabOnClick,
  wrapperClassName,
  iconProps,
}: TabSwitcherProps<E>) => {
  const match = useCallback((value: E, text: (value: E) => string | string) => {
    if (typeof text === "string") return text;
    return text(value);
  }, []);

  const { className: tabClassName, ...restTabProps } = tabProps ?? {};
  const { className: commonIconClassName, ...commonRestIconProps } =
    iconProps ?? {};

  return (
    <div
      className={tw(
        "hidden h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-100 p-0.5 dark:bg-[#0c0f17] dark:text-white md:flex",
        wrapperClassName,
      )}
    >
      {Object.values(tabs).map((tab) => {
        const Icon = tab.icon ? tab.icon : null;
        const { className: iconClassName, ...restIconProps } =
          tab.iconProps ?? {};

        return (
          <button
            key={tab.value}
            type="button"
            className={tw(
              "text-text relative flex h-full flex-1 cursor-pointer items-center justify-center gap-2 p-1.5 text-xs",
              currentTab === tab.value && "font-bold text-white",
              tab.disabledReason && "cursor-not-allowed",
              tabClassName,
            )}
            onClick={() => tabOnClick(tab.value)}
            onMouseEnter={tab.onHover}
            {...restTabProps}
            disabled={!!tab.disabledReason}
          >
            {Icon && (
              <Icon
                className={tw(
                  "z-10 size-5",
                  currentTab === tab.value && "text-primary",
                  commonIconClassName,
                  iconClassName,
                )}
                {...commonRestIconProps}
                {...restIconProps}
              />
            )}

            {currentTab === tab.value && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 z-0 rounded-md bg-[#0052cc]"
                transition={{
                  type: "spring",
                  bounce: 0.1,
                  duration: 0.5,
                }}
                style={{ originY: "0px" }}
              />
            )}
            <span className="relative z-10">
              {typeof tab.text === "string"
                ? tab.text
                : match(tab.value, tab.text)}
            </span>
          </button>
        );
      })}
    </div>
  );
};
