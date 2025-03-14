const posts = [
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl:
      "https://s3-alpha-sig.figma.com/img/6d25/b848/868a45956cdff79256c758f7a4a2b2c0?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=exGelrj0Hu50JnthIqNtD9L3BnLGdXGUxSUwklh8GjRGqRGjDCHglAddia-tyrGADQy4UP6u1ZrMNkIynhGPhtCqRigGK-kLF~fywpBiQvVkAikfXrd502RsFaYbGk10s-jjiM81zPF5092CcTw7RONSo1tG7uQk-2WxKkZlLFhxL~3SPw4wnTbNaR9dKEqQk2iNNLqZZoUJMI8Yd0YPeYFqYskmqMZ~bLLEM3-gsySODAOEAYQ8DhhfHF3EVPwSg2Tc1chu~MgEBGH5kFzAFgc6Pmo0W12B3jaW473xleKfxl644UYwnun6K3QKtDhOy1L3tGBGbdzfAy76H6wHig__",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
  },
  // New posts added below
  {
    id: 2,
    title: "The Future of AI in Marketing",
    href: "#",
    description:
      "Explore how artificial intelligence is transforming the marketing landscape and what it means for businesses.",
    imageUrl:
      "https://s3-alpha-sig.figma.com/img/2858/ba87/a48b9b55036a3c14ba972098b17935ae?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=qFcPv29A~xU7NHynvsGfIMZZxdHSMw2dHxFK5L-fZBZalrsGPSh9MtVhrcxdPRkDdvYWeGLDClnIJZT-H5sgTuUQxfPVP-IZjrlsEY72LkCX96opKcsBPAysh5ixOgXBMzQHRZmuhq8uc~eyTbYcIi2-M~krzKoK8QfaBGHxuU-3YKGMSZOb4aiWfRdKHLi~GqWmjTNetrDpIkZ5lfK4sC3HpXC0wEPrBlPupUE9lpoSrxo0VcxBkYLOpXpPKkfyPeIA3GYVt8zdUROt0IvVyvt-tyFGYqmiqIWyFb4ZEvAMQvKuusiEVCM0Ms5buR5qLHYGUtp~uN9f6SnnvnzYXw__",
    date: "Apr 10, 2021",
    datetime: "2021-04-10",
    category: { title: "Technology", href: "#" },
  },
  {
    id: 3,
    title: "Effective Social Media Strategies",
    href: "#",
    description:
      "Learn the best practices for engaging your audience on social media platforms.",
    imageUrl:
      "https://s3-alpha-sig.figma.com/img/f784/9ce8/886c2d16ea3d23bc0c529eed063fadfa?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Svc6ZKd0Q5fumcv53ZuVAljvscfT8cEIbDv~kkHaum8x0xHPO4R~vZ6dbahdWYnM546mmRDyHyx-ixnaxW1ZEaALK3aF~PcAFoleNqObjDZ80jLTgw0zFIHUT5X0O~DLi14chEgeQd3T9SZRlx4Ay4oKM4d8JA8A-3LM6d84csizJ6bnaEsa9rbi7MJ4AgsVxoba~V~PKQtYfB0DOYhsCvK6pgxZ2GsS4ITthZt06~pX3ZYWWJvnqzunrtrnPHdSYSmoDOO8pfLbgHnWL56oLgQrCZbqJtj6mQ1UuVNNwaFkyf-UwKor-OvPc-4CDOilifo3Uqjre52TqNKLtRybmg__",
    date: "May 5, 2021",
    datetime: "2021-05-05",
    category: { title: "Social Media", href: "#" },
  },
  {
    id: 4,
    title: "Content Marketing Trends",
    href: "#",
    description:
      "Stay ahead of the curve with the latest trends in content marketing.",
    imageUrl:
      "https://s3-alpha-sig.figma.com/img/34a6/5983/bd65641a3f9faf5bd9a739553f3174fb?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=b7rUzZ8uQLFufHfWryFeGsNajmZF4ZR9HvwMyqskyMq1goCEX27YgSbYLIy0uWFHyCmRLW~qtY7dkE5zzikm8tgILqiv3OQPmOW7ObQKzk53kXzQ5aRuEXteEVBpSzhSHhTZYOfXGnXt2ygQkovEvLVK50780PX4n~z2Y94nuBzcf89PqWa3nj-etxbKVk3-rGkwoeQRZnnTa34GhTBRrie1i70z1Ozkbpg7ySSWZCY77FnTwZ9js8RQjhoCLStRGt2pVMew-Uip1HCoGdTfXc3PQfRyvAyf8m-jOymc~jFmBJNqffja-qgQrk4MnWckUtP8LiVJhKqBil7wP09TuA__",
    date: "Jun 20, 2021",
    datetime: "2021-06-20",
    category: { title: "Content", href: "#" },
  },
  {
    id: 5,
    title: "Email Marketing Best Practices",
    href: "#",
    description:
      "Discover the key elements of successful email marketing campaigns.",
    imageUrl:
      "https://s3-alpha-sig.figma.com/img/e2f9/4485/de86c8fa826d2aee324f10e6135a8d48?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Ns6k8UQHZbSqkX-SeZQRjSShjYtmhGPOk9XqeUK2ilxBwXvzDMk1aj0pnpf37fGKHnuTUhy9teow54Z43YO4yLQT288nLl~sPFyoz~MqGIlGKKosbhMjHNk3xuLPAWZ5AMYB39c3SJYcqnAYJvJqZ7XU7i4T~XvCBpoLOdSrU7MTKMiynOKs35UHM6NMfkA27RmW8rRLJgZtKzXTrwJB6haPXIhaf-jlDqQP1cQfSrC3bv6nu~bLZJe9Kt6053xcL126WcxZqrjeT-~tziojbgOcTUFZnRQOdnbc5tzZ4~IEN6IgnSz9V4Tgid1jbhsFU8SEsj4kIXq2AY-68arxsA__",
    date: "Jul 15, 2021",
    datetime: "2021-07-15",
    category: { title: "Email", href: "#" },
  },
  {
    id: 6,
    title: "SEO Techniques for 2021",
    href: "#",
    description:
      "Learn the most effective SEO techniques to improve your website's visibility.",
    imageUrl:
      "https://s3-alpha-sig.figma.com/img/836e/7938/db8b93d2a67b139a69cacf960e76c8f8?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=URgSflpFi~Gpkio7iHMYPP3chOl4YXZcjogKJ9luhJvqTYWjFmaOr-isybMNORBchw9fQ6Q1y9L9oqkUYZoUsq72sTT8bTxNJ-SQuernrsERyDxXl-yakumcawFgwZcqQiUvj1n6oB37dQw2IJAkIXdh4UhGNXXlcftIWHhHlPUuYUXyLJU5SZqFipUXldlXQrL6XmVasLWsUc7EYrQW7cBzxV-Zm~iUv4hkLQM2Kk8-ShsazcsHT2AYJBjgVUfcGG-6eIjqo7eJRfb0dKJ8KGWQPMeOmV1VlBF9JTbCLj7z7uyIJ7P0hiMWg0VkolRZbmwWYEP2ZVrwWyq7tpEY7g__",
    date: "Aug 30, 2021",
    datetime: "2021-08-30",
    category: { title: "SEO", href: "#" },
  },
];

export default function TradingExperience() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-start justify-between"
            >
              <div className="relative w-full">
                <img
                  alt=""
                  src={post.imageUrl}
                  className="sm:aspect-2/1 lg:aspect-3/2 aspect-video w-full rounded-2xl bg-gray-100 object-cover"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-gray-500">
                    {post.date}
                  </time>
                  <a
                    href={post.category.href}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {post.category.title}
                  </a>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                    <a href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
                    {post.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
