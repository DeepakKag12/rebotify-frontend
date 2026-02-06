import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { validateEmail } from "../../../utils/validationSchemas";
import { toast } from "react-toastify";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");

  const handleNewsletterChange = async (e) => {
    const value = e.target.value;
    setNewsletterEmail(value);

    // Real-time validation
    const error = await validateEmail(value);
    setNewsletterError(error || "");
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    const error = await validateEmail(newsletterEmail);
    if (error) {
      setNewsletterError(error);
      toast.error(error);
      return;
    }

    // Success
    toast.success("Thank you for subscribing!");
    setNewsletterEmail("");
    setNewsletterError("");
  };
  const quickLinks = [
    { name: "About Us", href: "#about-us" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "FAQ", href: "/faq" },
  ];

  const accountLinks = [
    { name: "Sign Up", href: "/signup" },
    { name: "Sign In", href: "/login" },
    { name: "Forgot Password", href: "/forgot-password" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer id="contact" className="bg-brand-olive text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/">
              <h3 className="text-2xl font-bold mb-4 cursor-pointer hover:text-brand-green-light transition-colors">
                E-Waste<span className="text-brand-green-light">Hub</span>
              </h3>
            </Link>
            <p className="text-white/80 mb-4 leading-relaxed">
              Making e-waste recycling simple, secure, and sustainable for
              everyone.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-white/10 hover:bg-brand-green transition-all duration-300 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-brand-green-light transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4">Account</h4>
            <ul className="space-y-2 mb-6">
              {accountLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-brand-green-light transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-lg font-bold mb-4 mt-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-brand-green-light transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-3 text-brand-green-light" />
                <a
                  href="mailto:info@rebot.com"
                  className="text-white/80 hover:text-brand-green-light transition-colors"
                >
                  info@rebot.com
                </a>
              </li>
              <li className="flex items-start">
                <FaPhone className="mt-1 mr-3 text-brand-green-light" />
                <a
                  href="tel:+1234567890"
                  className="text-white/80 hover:text-brand-green-light transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-brand-green-light" />
                <span className="text-white/80">
                  123 Green Street, Eco City, EC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h4>
            <p className="text-white/80 mb-4">
              Get updates on e-waste recycling tips and environmental news
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="flex-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={handleNewsletterChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    newsletterError ? "border-red-500" : "border-white/30"
                  } focus:border-brand-green-light focus:outline-none text-white placeholder-white/50`}
                />
                {newsletterError && (
                  <p className="text-red-300 text-xs mt-1 text-left">
                    {newsletterError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-green hover:bg-brand-green-dark transition-all duration-300 rounded-lg font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
          <p>
            © {new Date().getFullYear()} Rebot. All rights reserved.
            <span className="mx-2">|</span>
            Made with <span className="text-brand-green-light">♥</span> for the
            Planet
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
