const Contact = () => {
  return (
    <div className="mx-auto my-24 flex h-auto max-w-7xl flex-col px-4 sm:px-6 lg:flex-row lg:px-8">
      <section className="hidden w-full rounded-lg bg-[rgb(0,82,204)] p-6 text-white shadow-lg lg:flex lg:w-1/2">
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold">Contact Details</h2>
          <p className="text-lg text-[#BCC5C8]">
            Feel free to reach out to us through the following channels:
          </p>

          <div>
            <h3 className="text-lg font-semibold">Our Address</h3>
            <p className="text-[#BCC5C8]">1230 Maecenas Street Donec Road</p>
            <p className="text-[#BCC5C8]">New York, EEUU</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contact</h3>
            <p className="text-[#BCC5C8]">
              Mobile: <span className="font-medium">+1 (123) 456-7890</span>
            </p>
            <p className="text-[#BCC5C8]">
              Email: <span className="font-medium">tailnext@gmail.com</span>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Working Hours</h3>
            <p className="text-[#BCC5C8]">
              Monday - Friday:{" "}
              <span className="font-medium">08:00 - 17:00</span>
            </p>
            <p className="text-[#BCC5C8]">
              Saturday & Sunday:{" "}
              <span className="font-medium">08:00 - 12:00</span>
            </p>
          </div>
        </div>
      </section>
      <section className="flex w-full flex-col justify-center p-4 lg:w-3/4">
        <form className="flex w-full flex-col space-y-4 p-6">
          <h2 className="mb-4 text-center text-2xl font-bold">Contact Us</h2>

          <div>
            <label htmlFor="name" className="mb-1 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full rounded bg-[#F5F5F5] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full rounded bg-[#F5F5F5] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 font-semibold">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Enter your message"
              className="w-full rounded bg-[#F5F5F5] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            ></textarea>
          </div>

          <div className="flex flex-col items-start justify-between md:flex-row">
            <div className="mb-4 flex items-center">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-sm">
                I have read and accept the Terms of Service & Privacy Policy{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="flex">
              <button
                type="submit"
                className="w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 sm:w-auto"
              >
                Send Message
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Contact;
