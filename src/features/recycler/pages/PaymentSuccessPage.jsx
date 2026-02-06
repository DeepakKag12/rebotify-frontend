import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { bidAPI } from "../../../services/bidService";
import { toast } from "react-toastify";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your payment...");
  const hasVerified = useRef(false);

  useEffect(() => {
    // Prevent double verification in React StrictMode
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const listingId = searchParams.get("listing_id");

      if (!sessionId || !listingId) {
        setStatus("error");
        setMessage("Invalid payment parameters");
        return;
      }

      try {
        const response = await bidAPI.verifyStripeCheckout(listingId, sessionId);

        if (response.success) {
          setStatus("success");
          if (response.alreadyPaid) {
            setMessage("Payment was already verified. Transaction completed successfully.");
            toast.info("Payment already completed");
          } else {
            setMessage("Payment successful! Invoices have been sent to both you and the seller via email.");
            toast.success("🎉 Payment completed! Check your email for the invoice.");
          }

          // Redirect after 4 seconds to give user time to read
          setTimeout(() => {
            navigate("/recycler/bids");
          }, 4000);
        } else {
          setStatus("error");
          setMessage("Payment verification failed. Please contact support.");
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        
        // Check if it's already paid error
        if (error.response?.data?.alreadyPaid || error.response?.data?.message === "Payment already processed") {
          setStatus("success");
          setMessage("Payment was already verified. Transaction completed successfully.");
          toast.info("Payment already processed");
          setTimeout(() => {
            navigate("/recycler/bids");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            error.response?.data?.message || "Failed to verify payment. Please contact support."
          );
          toast.error("Payment verification failed");
        }
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
      >
        {status === "verifying" && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verifying Payment
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Payment Successful! 🎉
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="space-y-3 text-sm text-green-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold">✅ Payment Processed</p>
                    <p className="text-green-700">Your payment has been successfully verified</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold">📧 Invoices Sent</p>
                    <p className="text-green-700">Both you and the seller received invoice emails</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold">📦 Delivery Scheduled</p>
                    <p className="text-green-700">Delivery details created and tracking assigned</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-6">
              <p className="font-semibold mb-1">📬 Check Your Email</p>
              <p>Your invoice and transaction details have been sent to your registered email address.</p>
            </div>
            <button
              onClick={() => navigate("/recycler/bids")}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Go to My Bids
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Payment Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 mb-6">
              <p className="font-semibold mb-1">Need Help?</p>
              <p>Please contact our support team with your order details.</p>
            </div>
            <button
              onClick={() => navigate("/recycler/bids")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Back to My Bids
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
