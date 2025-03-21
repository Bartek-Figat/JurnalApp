import { FaChartLine, FaLock, FaUser, FaBell } from "react-icons/fa";

const features = [
  {
    name: "Comprehensive Analytics",
    description: "Gain insights, track trends, and optimize.",
    icon: FaLock,
    bg: "bg-[#38C975]",
  },
  {
    name: "Secure and Reliable",
    description: "Top-notch security and reliable data storage.",
    icon: FaBell,
    bg: "bg-[#FEA53F]",
  },
  {
    name: "User-Friendly Interface",
    description: " Simple design for easy navigation by all traders.",
    icon: FaChartLine,
    bg: "bg-[#3DAEFF]",
  },
  {
    name: "Real-Time Notifications",
    description: "Stay updated to make timely market decisions.",
    icon: FaUser,
    bg: "bg-[#FE4543]",
  },
];

export default function EverythingYou() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            Powerful Features for Trading Success
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            Experience robust security, intuitive simplicity, and real-time
            insights. Our platform ensures your data is protected, navigation is
            effortless, and you stay informed with timely updates to make
            optimal trading decisions with confidence.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div
                    className={`absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg ${feature.bg}`}
                  >
                    <feature.icon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
