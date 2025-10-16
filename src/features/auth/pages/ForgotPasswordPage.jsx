import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);

    // Simulate API call (implement actual forgot password API later)
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email!");
    }, 1500);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-brand-green/5 to-brand-olive/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-brand-green" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>. Please
            check your inbox and follow the instructions.
          </p>
          <div className="space-y-3">
            <Link to="/login">
              <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white">
                Back to Login
              </Button>
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-brand-green/5 to-brand-olive/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-brand-olive">Rebot</span>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={handleChange}
            error={error}
            required
            autoComplete="email"
            autoFocus
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-brand-green hover:bg-brand-green-dark text-white font-medium rounded-lg transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-brand-green transition-colors mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
