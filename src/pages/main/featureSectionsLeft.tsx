import {
  ArrowTrendingUpIcon,
  ArrowLeftStartOnRectangleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/20/solid";
import LeftImage from "../../img/left.png";

const features = [
  {
    name: "Instant Trade Analysis",
    description:
      "Capture and review your trades effortlessly, keeping you informed and ready to adapt to market movements in real-time.",
    icon: ArrowTrendingUpIcon,
  },
  {
    name: "Smart Trade Documentation",
    description:
      "Quickly log each trade with intuitive tools that make journaling a seamless and stress-free part of your routin",
    icon: ArrowLeftStartOnRectangleIcon,
  },
  {
    name: "Dynamic Performance Metrics",
    description:
      "Gain immediate access to detailed performance insights to refine your strategies and make confident, data-driven decisions.",
    icon: AdjustmentsHorizontalIcon,
  },
];

export default function FeatureSectionsLeft() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Optimize Your Trading
              </p>

              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute left-1 top-1 size-5 text-indigo-600"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <div className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"></div>
            <img
              alt="Product screenshot"
              src={LeftImage}
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
