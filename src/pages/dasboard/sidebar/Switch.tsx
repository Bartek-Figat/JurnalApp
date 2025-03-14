import * as SwitchPrimitive from "@radix-ui/react-switch";
import { tw } from "../helpers/tw";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={tw(
        "data-[state=checked]:bg-primary-foreground data-[state=unchecked]:bg-background focus-visible:border-ring focus-visible:ring-ring/50 shadow-xs peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={tw(
          "data-[state=checked]:bg-primary pointer-events-none block size-4 rounded-full bg-gray-400 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
