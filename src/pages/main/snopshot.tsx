import {
  FaChartLine,
  FaPlug,
  FaLock,
  FaCloud,
  FaTasks,
  FaTachometerAlt,
} from "react-icons/fa";

const Snapshot: React.FC = () => (
  <section id="snapshot" className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Frame One */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900">
          Boost Your Productivity
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Enhance your workflow with advanced features
        </p>
      </div>
      {/* Frame Two */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group flex h-64 flex-col justify-between rounded bg-white p-4 shadow transition hover:bg-[#0052CC]">
          <div className="flex flex-grow flex-col">
            {" "}
            <div className="mb-4 flex items-center">
              <FaChartLine className="h-8 w-8 text-blue-600 group-hover:text-white" />
            </div>
          </div>
          <div className="flex flex-grow flex-col">
            <h3 className="text-xl font-semibold group-hover:text-white">
              Advanced Analytics
            </h3>
            <p className="mt-2 text-gray-600 group-hover:text-white">
              Track and analyze your data with powerful analytics tools.
            </p>
          </div>
        </div>

        <div className="group flex h-64 flex-col justify-between rounded bg-white p-4 shadow transition hover:bg-[#0052CC]">
          <div className="flex flex-grow flex-col">
            {" "}
            <div className="mb-4 flex items-center">
              <FaPlug className="h-8 w-8 text-blue-600 group-hover:text-white" />
            </div>
          </div>

          <div className="flex flex-grow flex-col">
            <h3 className="text-xl font-semibold group-hover:text-white">
              Fast Integration
            </h3>
            <p className="mt-2 text-gray-600 group-hover:text-white">
              Seamlessly integrate with your existing tools and systems for a
              smooth workflow experience.
            </p>
          </div>
        </div>
        <div className="group flex h-64 flex-col justify-between rounded bg-white p-4 shadow transition hover:bg-[#0052CC]">
          <div className="flex flex-grow flex-col">
            {" "}
            <div className="mb-4 flex items-center">
              <FaLock className="h-8 w-8 text-blue-600 group-hover:text-white" />
            </div>
          </div>

          <div className="flex flex-grow flex-col">
            {" "}
            <h3 className="text-xl font-semibold group-hover:text-white">
              Security First
            </h3>
            <p className="mt-2 text-gray-600 group-hover:text-white">
              Ensure the safety of your data with top-notch security features.
              Your privacy is our priority.
            </p>{" "}
          </div>
        </div>
        <div className="group flex h-64 flex-col justify-between rounded bg-white p-4 shadow transition hover:bg-[#0052CC]">
          <div className="flex flex-grow flex-col">
            {" "}
            <div className="mb-4 flex items-center">
              <FaCloud className="h-8 w-8 text-blue-600 group-hover:text-white" />
            </div>
          </div>

          <div className="flex flex-grow flex-col">
            {" "}
            <h3 className="text-xl font-semibold group-hover:text-white">
              Cloud Integration
            </h3>
            <p className="mt-2 text-gray-600 group-hover:text-white">
              Access your data from anywhere with seamless cloud integration.
              Work without boundaries.
            </p>
          </div>
        </div>
        <div className="group flex h-64 flex-col justify-between rounded bg-white p-4 shadow transition hover:bg-[#0052CC]">
          <div className="flex flex-grow flex-col">
            <div className="mb-4 flex items-center">
              <FaTasks className="h-8 w-8 text-blue-600 group-hover:text-white" />
            </div>
          </div>

          <div className="flex flex-grow flex-col">
            <h3 className="text-xl font-semibold group-hover:text-white">
              Task Management
            </h3>
            <p className="mt-2 text-gray-600 group-hover:text-white">
              Organize your workflow with efficient task management features.
            </p>{" "}
          </div>
        </div>
        <div className="group flex h-64 flex-col justify-between rounded bg-white p-4 shadow transition hover:bg-[#0052CC]">
          <div className="flex flex-grow flex-col">
            <div className="mb-4 flex items-center">
              <FaTachometerAlt className="h-8 w-8 text-blue-600 group-hover:text-white" />
            </div>
          </div>

          <div className="flex flex-grow flex-col">
            <h3 className="text-xl font-semibold group-hover:text-white">
              Performance Metrics
            </h3>
            <p className="mt-2 text-gray-600 group-hover:text-white">
              Monitor and measure your performance with comprehensive metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Snapshot;
