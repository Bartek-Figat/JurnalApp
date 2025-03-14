import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

const Footer: React.FC = () => (
  <footer className="bg-[#121312] py-10">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 text-gray-300 md:grid-cols-4">
        {/* Company Info */}
        <div>
          <h3 className="mb-2 font-bold text-white">Company Info</h3>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Features</li>
            <li>Testimonials</li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="mb-2 font-bold text-white">Features</h3>
          <ul>
            <li>Snapshot</li>
            <li>Pricing</li>
            <li>Faqs</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-2 font-bold text-white">Services</h3>
          <ul>
            <li>1on1 Coaching</li>
            <li>Company Review</li>
            <li>Accounts Review</li>
            <li>HR Consulting</li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h3 className="mb-2 font-bold text-white">Get in Touch</h3>
          <p>1230 Maecenas Street Donec Road</p>
          <p>New York, EEUU</p>
          <p>+1 (123) 456-7890</p>
          <p>Tailnext@gmail.com</p>
          <p>Monday - Friday: 08:00 - 17:00</p>
          <p>Saturday & Sunday: 08:00 - 12:00</p>
        </div>
      </div>

      {/* Join Our Community */}
      <div className="mt-8 text-center">
        <h3 className="mb-2 font-bold text-white">Join Our Community</h3>
        <ul className="flex justify-center space-x-4 text-gray-300">
          <li>
            <FaFacebookF className="text-2xl hover:text-blue-500" />
          </li>
          <li>
            <RiTwitterXFill className="text-2xl hover:text-blue-400" />
          </li>
          <li>
            <FaInstagram className="text-2xl hover:text-pink-500" />
          </li>
          <li>
            <FaLinkedinIn className="text-2xl hover:text-blue-700" />
          </li>
          <li>
            <FaYoutube className="text-2xl hover:text-red-600" />
          </li>
        </ul>
      </div>

      {/* Legal Links */}
      <div className="mt-8 text-center">
        <ul className="flex justify-center space-x-4 text-gray-400">
          <li>Terms & Conditions</li>
          <li>Privacy Policy</li>
          <li>Cookies</li>
        </ul>
        <p className="mt-4 text-gray-400">
          © 2024. Company Name. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
