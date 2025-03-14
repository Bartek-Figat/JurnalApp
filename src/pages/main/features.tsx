const TradingFeatures = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Elevate Your Trading Experience
      </h2>
      <p className="mb-8 text-center">
        Optimize your strategies with our advanced tools.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="transform rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Real-Time Data"
            className="h-32 w-full rounded-t-lg object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">Real-Time Data</h3>
            <p className="mt-2">
              Access live market data and analytics to make informed trading
              decisions. Stay ahead of the curve with up-to-the-minute
              information.
            </p>
            <p className="mt-4 block text-blue-600">Read more</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="transform rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Advanced Charting"
            className="h-32 w-full rounded-t-lg object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">Advanced Charting</h3>
            <p className="mt-2">
              Utilize advanced charting tools to visualize market trends and
              patterns. Customize your charts to suit your trading style and
              preferences.
            </p>
            <p className="mt-4 block text-blue-600">Read more</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="transform rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1629339941379-da30348cdba6?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Custom Alerts"
            className="h-32 w-full rounded-t-lg object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">Custom Alerts</h3>
            <p className="mt-2">
              Set personalized alerts for price changes, volume spikes, and
              other market events. Never miss an opportunity with timely
              notifications.
            </p>
            <p className="mt-4 block text-blue-600">Read more</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="transform rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1639754390580-2e7437267698?q=80&w=2041&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Portfolio Management"
            className="h-32 w-full rounded-t-lg object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">Portfolio Management</h3>
            <p className="mt-2">
              Manage your investments with our intuitive portfolio management
              tools. Track performance, analyze risk, and optimize your asset
              allocation.
            </p>
            <p className="mt-4 block text-blue-600">Read more</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="transform rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1621264448270-9ef00e88a935?q=80&w=2157&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Risk Assessment"
            className="h-32 w-full rounded-t-lg object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">Risk Assessment</h3>
            <p className="mt-2">
              Evaluate your trading strategies with comprehensive risk
              assessment tools. Make data-driven decisions to minimize potential
              losses.
            </p>
            <p className="mt-4 block text-blue-600">Read more</p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="transform rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User-Friendly Interface"
            className="h-32 w-full rounded-t-lg object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">User-Friendly Interface</h3>
            <p className="mt-2">
              Experience a seamless user interface designed for traders of all
              levels. Navigate effortlessly and access all features with ease.
            </p>
            <p className="mt-4 block text-blue-600">Read more</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingFeatures;
