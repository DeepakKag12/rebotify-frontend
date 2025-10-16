import { motion } from 'framer-motion'
import { FaLeaf, FaShieldAlt, FaChartLine, FaBolt } from 'react-icons/fa'

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: FaLeaf,
      title: 'Environmental Impact',
      description: 'Save the planet by properly recycling electronics. Every item counts towards a greener future.',
      color: 'brand-green',
    },
    {
      icon: FaShieldAlt,
      title: 'Secure & Certified',
      description: 'Your data safety is our priority. All recyclers are certified and follow strict security protocols.',
      color: 'brand-olive',
    },
    {
      icon: FaChartLine,
      title: 'Easy Tracking',
      description: 'Real-time updates on your listing status. Know exactly where your items are at every step.',
      color: 'brand-green',
    },
    {
      icon: FaBolt,
      title: 'Quick Process',
      description: 'Hassle-free disposal from start to finish. Get matched and scheduled within 24 hours.',
      color: 'brand-olive',
    },
  ]

  return (
    <section id="about-us" className="py-20 bg-gradient-to-br from-brand-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-brand-olive mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-brand-gray-medium max-w-2xl mx-auto">
            The smartest way to handle your electronic waste responsibly
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className={`bg-${benefit.color}/10 rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                <benefit.icon className={`text-3xl text-${benefit.color}`} />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-4">
                {benefit.title}
              </h3>
              <p className="text-brand-gray-medium leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-brand-olive rounded-3xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Trusted by Thousands</h3>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Join our community of environmentally conscious users making a real difference. 
            Together, we've prevented tons of e-waste from ending up in landfills.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-brand-green-light">100%</div>
              <div className="text-sm opacity-80">Certified Recyclers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-green-light">24/7</div>
              <div className="text-sm opacity-80">Customer Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-green-light">4.9★</div>
              <div className="text-sm opacity-80">Average Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhyChooseUs
