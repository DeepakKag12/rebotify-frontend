import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "./button";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Loader2, CreditCard, Lock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      fontFamily: "system-ui, sans-serif",
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

export const StripePaymentModal = ({
  isOpen,
  onClose,
  clientSecret,
  amount,
  productDetails,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'error', null

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    if (!clientSecret) {
      toast.error("Payment configuration missing. Please try again.");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: productDetails?.buyerName || "Customer",
            },
          },
        }
      );

      if (error) {
        console.error("Payment error:", error);
        setPaymentStatus("error");
        toast.error(error.message || "Payment failed. Please try again.");
        onPaymentError?.(error);
      } else if (paymentIntent.status === "succeeded") {
        console.log("Payment successful:", paymentIntent);
        setPaymentStatus("success");
        toast.success("Payment successful! Processing your order...");
        onPaymentSuccess?.(paymentIntent);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setPaymentStatus("error");
      toast.error("An unexpected error occurred. Please try again.");
      onPaymentError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setPaymentStatus(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Enter your card details to complete the purchase
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === "success" ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-green-700">
              Payment Successful!
            </h3>
            <p className="text-gray-600">
              Your payment has been processed successfully.
            </p>
          </div>
        ) : paymentStatus === "error" ? (
          <div className="py-8 text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold text-red-700">
              Payment Failed
            </h3>
            <p className="text-gray-600">
              Please try again or use a different payment method.
            </p>
            <Button
              onClick={() => setPaymentStatus(null)}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Payment Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Amount to pay:</span>
                <span className="text-2xl font-bold text-blue-900">
                  ₹{amount?.toLocaleString("en-IN")}
                </span>
              </div>
              {productDetails?.name && (
                <p className="text-sm text-gray-600 mt-2">
                  {productDetails.name}
                </p>
              )}
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 bg-white">
                    <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>

                {/* Card Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 bg-white">
                      <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 bg-white">
                      <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Card Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs">
                <p className="font-semibold text-yellow-800 mb-1">
                  Test Mode:
                </p>
                <p className="text-yellow-700">
                  Use card: <code className="font-mono">4242 4242 4242 4242</code>
                  <br />
                  Any future expiry date and any 3-digit CVC
                </p>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!stripe || isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ₹{amount?.toLocaleString("en-IN")}</>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
