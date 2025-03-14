import Dasboard from "../../img/dasboard.png";

const Hero = () => {
  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-[#000205] to-[#343434]">
      <img
        src="https://s3-alpha-sig.figma.com/img/3ec1/af2b/e65494fa4601b9e2296634a27871dad0?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PpBfXa~zshtizqDSIYMxN12KVYFMz4JJUkl0BMMJY1khKSLVq-Al2c0-fYblD8qrAnmnhwVqj1qG00xsYh~ce8eia1KdAgTQA06J94rV07~iuPTwrZtQvRy~xjbbQTwyRsEPPc97Yc660uIDNNSJh37NkOsway59uY1c0JnzbjXQhhxO63tQ7wjkzXf-f7zy-0jbcHjlCQoWafAtgl~K7NU-D2ArtfHn5zo0xHyU8kr0bpjBj0xBz2BbDVq50V~6lntXgVo5eDdmVlObd6FKbFbiQBzIt-lqDwcaSSvmwszw7Uzqy1NH8k5ObrofAnqq-zMPZdSr02FdQ7ECNk~sgg__"
        alt=""
        className="absolute h-screen bg-center object-cover mix-blend-overlay"
      />
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          Track Your Trades <br />
          with Our <span className="text-blue-900">Trading Journal</span>
        </h1>
        <p className="mt-3 text-lg text-gray-300 sm:mx-auto sm:mt-5 sm:max-w-2xl sm:text-xl md:mt-5 md:text-2xl">
          Our trading journal provides you with the tools to analyze your
          trading performance, identify patterns, and improve your strategies.
          Start documenting your trades and take control of your trading journey
          today!
        </p>
        <div className="isolate mt-8 flex justify-center space-x-4">
          <button className="rounded-md bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700">
            Get Started
          </button>
          <button className="rounded-md border border-gray-400 px-6 py-3 text-lg font-medium text-white hover:bg-gray-900">
            Learn More
          </button>
        </div>
        <div className="mt-14 flow-root sm:mt-24">
          <div className="isolate -m-2 rounded-xl p-2 lg:-m-4 lg:rounded-2xl lg:p-4">
            <img
              alt="App screenshot"
              src={Dasboard}
              width={2432}
              height={1442}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
