import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Input from '../../../components/ui/input';
import PasswordInput from '../../../components/ui/password-input';
import Checkbox from '../../../components/ui/checkbox';
import { Button } from '../../../components/ui/button';
import { useSignup } from '../../../services/authService';

const SignupPage = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending } = useSignup();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    userType: 'user',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // if (!formData.password) {
    //   newErrors.password = 'Password is required';
    // } else if (formData.password.length < 4) {
    //   newErrors.password = 'Password must be at least 4 characters';
    // } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    //   newErrors.password = 'Password must contain uppercase, lowercase, and number';
    // }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const signupData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      userType: formData.userType,
    };

    signup(signupData, {
      onSuccess: (data) => {
        toast.success('Account created successfully! Please login to continue.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-olive">Rebot</span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us in making a greener future</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              autoComplete="name"
              autoFocus
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Address"
              type="text"
              name="address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
              autoComplete="street-address"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Account Type <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
              >
                <option value="user">User</option>
                <option value="recycler">Recycler</option>
                <option value="delivery-partner">Delivery Partner</option>
              </select>
            </div>

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              showStrengthIndicator
              autoComplete="new-password"
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <Checkbox
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              error={errors.agreeToTerms}
              label={
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-brand-green hover:text-brand-green-dark">
                    Terms & Conditions
                  </Link>
                </span>
              }
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-brand-green hover:bg-brand-green-dark text-white font-medium rounded-lg transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login (Optional for future) */}
            <div className="text-center text-sm text-gray-600">
              Social signup coming soon...
            </div>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-brand-green hover:text-brand-green-dark transition-colors"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-olive to-brand-green p-12 items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-white max-w-lg"
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Be part of the solution. Create an account today and start your journey towards
              sustainable e-waste management.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Quick and easy registration',
              'Secure account protection',
              'Access to all features',
              'Join thousands of users',
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
