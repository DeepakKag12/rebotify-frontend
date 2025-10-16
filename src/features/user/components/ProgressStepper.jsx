import { motion } from "framer-motion";
import { Check } from "lucide-react";

const ProgressStepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isCompleted
                      ? "bg-brand-green border-brand-green"
                      : isCurrent
                      ? "bg-white border-brand-green ring-4 ring-brand-green/20"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <span
                      className={`text-lg font-semibold ${
                        isCurrent ? "text-brand-green" : "text-gray-400"
                      }`}
                    >
                      {step.number}
                    </span>
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                  className={`mt-2 text-sm font-medium text-center ${
                    isCurrent
                      ? "text-brand-green"
                      : isCompleted
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </motion.span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 -mt-12 relative">
                  <div className="absolute inset-0 bg-gray-300" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: isCompleted ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="absolute inset-0 bg-brand-green origin-left"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
