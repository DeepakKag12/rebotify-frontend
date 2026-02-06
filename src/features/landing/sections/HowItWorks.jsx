import { motion } from 'framer-motion'
import { FaClipboardList, FaHandshake, FaTruck, FaCheckCircle } from 'react-icons/fa'

const HowItWorks = () => {
  const steps = [
    {
      icon: FaClipboardList,
      title: 'Create a Listing',
      description: 'List your e-waste items with photos and details. Quick and easy process.',
    },
    {
      icon: FaHandshake,
      title: 'Get Matched',
      description: 'We connect you with certified recyclers in your area automatically.',
    },
    {
      icon: FaTruck,
      title: 'Schedule Pickup',
      description: 'Choose convenient pickup time or drop-off location that works for you.',
    },
    {
      icon: FaCheckCircle,
      title: 'Track & Confirm',
      description: 'Monitor your listing status and receive confirmation upon completion.',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-gradient-to-b from-white to-brand-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-olive mb-3">
            How It Works
          </h2>
          <p className="text-lg text-brand-gray-medium max-w-2xl mx-auto">
            Four simple steps to responsibly dispose of your electronic waste
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                {index + 1}
              </div>

              {/* Card */}
              <div className="bg-brand-light rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-brand-green">
                <div className="bg-brand-green/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <step.icon className="text-3xl text-brand-green" />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-3">
                  {step.title}
                </h3>
                <p className="text-brand-gray-medium leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (except last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-brand-green"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-brand-green"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
