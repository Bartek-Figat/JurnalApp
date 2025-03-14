const stats = [
  { id: 1, name: "Growing together", value: "10k Trades" },
  { id: 2, name: "Your knowledge arsenal", value: "5k Strategies" },
  { id: 3, name: "Experience in number", value: "1M Trade" },
];

const About: React.FC = () => (
  <section
    id="about"
    className="flex justify-center py-20 sm:mt-60 md:mt-64 lg:mt-96"
  >
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className="text-base/7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
);

export default About;
