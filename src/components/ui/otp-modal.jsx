import { useState, useEffect } from "react";
import { X, Mail, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import OTPInput from "./otp-input";

const OTPModal = ({
  isOpen,
  onClose,
  onVerify,
  email,
  expiresAt,
  isPending,
}) => {
  const [otp, setOTP] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setOTP("");
      setError("");
      setTimeLeft(120);
      return;
    }

    // Calculate time left based on expiresAt
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const secondsLeft = Math.max(0, Math.floor((expiry - now) / 1000));

      setTimeLeft(secondsLeft);

      if (secondsLeft === 0) {
        setError("OTP has expired. Please login again.");
        clearInterval(interval);
        // Auto close modal after expiry
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, expiresAt, onClose]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    if (timeLeft === 0) {
      setError("OTP has expired. Please login again.");
      return;
    }

    setError("");
    onVerify(otp);
  };

  const handleOTPChange = (value) => {
    setOTP(value);
    setError("");

    // Auto-submit when 6 digits are entered
    if (value.length === 6 && timeLeft > 0) {
      setTimeout(() => {
        onVerify(value);
      }, 300);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-green to-emerald-600 p-6 text-white relative">
              <button
                onClick={onClose}
                disabled={isPending || timeLeft > 0}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={
                  timeLeft > 0 ? "Cannot close while OTP is active" : "Close"
                }
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Verify OTP</h2>
                  <p className="text-white/90 text-sm">
                    Enter verification code
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Message */}
              <div className="text-center space-y-2">
                <p className="text-gray-700">We've sent a 6-digit OTP to</p>
                <p className="font-semibold text-brand-green text-lg">
                  {email}
                </p>
                <p className="text-sm text-gray-500">
                  Enter the OTP below to complete your login
                </p>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Clock
                  className={`w-5 h-5 ${
                    timeLeft < 30 ? "text-red-500" : "text-gray-500"
                  }`}
                />
                <span
                  className={`font-mono text-lg font-semibold ${
                    timeLeft < 30 ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* OTP Input */}
              <OTPInput
                length={6}
                value={otp}
                onChange={handleOTPChange}
                error={error}
              />

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                disabled={isPending || otp.length !== 6 || timeLeft === 0}
                className="w-full h-12 bg-brand-green hover:bg-brand-green-dark text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              {/* Help Text */}
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  Didn't receive the OTP? Please check your spam folder or try
                  logging in again.
                </p>
                {timeLeft > 0 && (
                  <p className="text-xs text-amber-600 font-medium">
                    ⚠️ This window will stay open until OTP expires or is
                    verified
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OTPModal;
