import { useIsClient, useTernaryDarkMode } from "usehooks-ts";
import { noop } from "../helpers/noop";
import { tw } from "../helpers/tw";
import { Switch } from "./Switch";

export const DarkModeSwitcher = ({ className }: { className?: string }) => {
  const { isDarkMode, setTernaryDarkMode } = useTernaryDarkMode();

  const isClient = useIsClient();

  return (
    <div className={tw("flex items-center space-x-2", className)}>
      <Switch
        checked={isClient ? isDarkMode : false}
        onCheckedChange={
          isClient
            ? () => setTernaryDarkMode(isDarkMode ? "light" : "dark")
            : noop
        }
        disabled={!isClient}
      />
    </div>
  );
};
