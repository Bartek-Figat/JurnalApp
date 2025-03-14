import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  return (
    <div className="col-span-7 flex min-h-screen bg-gray-50 max-[1200px]:col-span-12">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg max-[375px]:p-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(_values: any, { resetForm }) => {
              try {
                alert("Login successful!");
              } catch (err) {
                console.error("Login failed:", err);
                alert("Login failed. Please try again.");
              }
              resetForm();
            }}
          >
            {({
              handleChange,
              handleBlur,
              values,
              isSubmitting,
              errors,
              touched,
            }) => (
              <Form aria-label="Login Form" className="flex flex-col space-y-6">
                <h2 className="text-center text-2xl font-bold">Log In</h2>
                <p className="text-center text-gray-600">
                  Welcome back! Please log in to your account.
                </p>

                {/* Email Address Field */}
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500"
                />

                {/* Password Field */}
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500"
                />

                {/* Login Button */}
                <button
                  type="submit"
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging In..." : "Log In"}
                </button>

                <p className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-500 hover:underline">
                    Sign up
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="relative hidden flex-1 items-center justify-center lg:flex">
        {/* Placeholder for the image */}
        <div className="h-screen bg-center object-cover">
          <img
            src="https://s3-alpha-sig.figma.com/img/59b3/07fa/70ddfc92bab28bd8fb79e085dbbf93c3?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PRKU3bmNo4JlDPYLglWd55m1rhbgLP6utskwaZ342vOPmEfFgSGHouXoJ0mypovdV67GVld3lxj90aVTx9wBSUmoWUWYkNLtj2jnnR8SOY~2uAglXD7MsCLA-iuH2aPCaTzUbKvsjcPMVhe-sY2T8~zLX9V9iBoSr4SRV6uoDjbZsLE56aiO8MbpYxZ4-AvCHEu30q~S~0JtfISjp2zyOrzDRTH3ahNc-~YyZdz2CxbcmBXWMkgDjPgwG99ZVM~iU1yEMsBa1kuaws~Mzj4pgdHWIuiBW~pRXOWNGBNVhXs22ufH3XYkZwvIiJSM9Qhs1xEpoNhQ7CiqAL5dw~3gtA__"
            alt="Description"
            className="h-full w-full object-cover"
          />
          {/* Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600 bg-opacity-50 text-white">
            <div className="max-w-[660px] text-center">
              <h1 className="text-6xl font-bold">Trade Keeper</h1>
              <p className="mt-10 text-lg">
                TradeKeeper is more than a platform - it's a community.
              </p>
              <p className="text-md mt-2">
                Connect with professionals, share insights, and grow your
                network. Join us and be part of a vibrant community of journal
                marketers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
