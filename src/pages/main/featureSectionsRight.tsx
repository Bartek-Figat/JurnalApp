import {
  CursorArrowRippleIcon,
  DocumentArrowUpIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import RightImage from "../../img/right.png";

const features = [
  {
    name: "One-Click Trade Insights",
    description:
      "Record and analyze your trades in seconds, ensuring you stay ahead of market trends without breaking focus.",
    icon: CursorArrowRippleIcon,
  },
  {
    name: "Intuitive Trade Tracking",
    description:
      "Easily document every trade with user-friendly tools that simplify your journal entries and help you maintain consistency.",
    icon: DocumentArrowUpIcon,
  },
  {
    name: "Real-Time Analytics",
    description:
      "Access comprehensive performance metrics instantly, so you can refine your strategies and make informed decisions on the fly.",
    icon: ClockIcon,
  },
];

export default function FeatureSectionsRight() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Streamline Your Trading
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
          <img
            alt="Product screenshot"
            src={RightImage}
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
