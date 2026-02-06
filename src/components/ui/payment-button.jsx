import React, { useState } from "react";
import { bidAPI } from "../../services/bidService";
import { toast } from "react-toastify";
import { Button } from "./button";
import { CreditCard, Loader2 } from "lucide-react";

export const PaymentButton = ({ listingId, amount, productName, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleInitiatePayment = async () => {
    setIsLoading(true);
    try {
      const response = await bidAPI.createStripeCheckoutSession(listingId);
      
      if (response.success && response.url) {
        // Redirect to Stripe Checkout page
        window.location.href = response.url;
      } else {
        toast.error("Failed to initialize payment. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error(
        error.response?.data?.message || "Failed to initialize payment"
      );
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleInitiatePayment}
      disabled={isLoading}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting to Stripe...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay ₹{amount?.toLocaleString("en-IN")} Now
        </>
      )}
    </Button>
  );
};
