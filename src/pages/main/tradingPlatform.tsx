import { FaChartLine, FaLock, FaUser, FaBell } from "react-icons/fa";

const TradingPlatform = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {/* Frame on the left */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Icon Card 1 */}
          <div className="flex h-[226px] w-full max-w-[288px] flex-col items-start rounded-lg p-3 text-black">
            <div className="flex flex-col items-start">
              <FaChartLine className="mr-2 h-8 w-8 rounded-lg bg-[#38C975] p-2 text-white" />
              <h2 className="mt-2 text-xl font-semibold">
                Comprehensive Analytics
              </h2>
              <p className="mt-2 text-sm text-[#727779]">
                Gain insights, track trends, and optimize.
              </p>
            </div>
          </div>

          {/* Icon Card 2 */}
          <div className="flex h-[226px] w-full max-w-[288px] flex-col items-start rounded-lg p-3 text-black">
            <div className="flex flex-col items-start">
              <FaLock className="mr-2 h-8 w-8 rounded-lg bg-[#FEA53F] p-2 text-white" />
              <h2 className="text-xl font-semibold">Secure and Reliable</h2>
              <p className="mt-2 text-sm text-[#727779]">
                Top-notch security and reliable data storage.
              </p>
            </div>
          </div>

          {/* Icon Card 3 */}
          <div className="flex h-[226px] w-full max-w-[288px] flex-col items-start rounded-lg p-3 text-black">
            <div className="flex flex-col items-start">
              <FaUser className="mr-2 h-8 w-8 rounded-lg bg-[#3DAEFF] p-2 text-white" />
              <h2 className="text-xl font-semibold">User-Friendly Interface</h2>
              <p className="mt-2 text-sm text-[#727779]">
                Simple design for easy navigation by all traders.
              </p>
            </div>
          </div>

          {/* Icon Card 4 */}
          <div className="flex h-[226px] w-full max-w-[288px] flex-col items-start rounded-lg p-3 text-black">
            <div className="flex flex-col items-start">
              <FaBell className="mr-2 h-8 w-8 rounded-lg bg-[#FE4543] p-2 text-white" />
              <h2 className="text-xl font-semibold">Real-Time Notifications</h2>
              <p className="mt-2 text-sm text-[#727779]">
                Stay updated to make timely market decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Frame on the right */}
        <div className="flex flex-col justify-center gap-10 rounded-lg bg-white p-6">
          <h2 className="text-2xl font-semibold text-gray-800 md:text-4xl">
            Powerful Features for Trading Success
          </h2>
          <p className="text-gray-600">
            Experience robust security, intuitive simplicity, and real-time
            insights. Our platform ensures your data is protected, navigation is
            effortless, and you stay informed with timely updates to make
            optimal trading decisions with confidence.
          </p>
          <div>
            <button className="mt-auto rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPlatform;
