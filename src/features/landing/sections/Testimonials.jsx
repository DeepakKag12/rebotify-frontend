import { motion } from 'framer-motion'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 5,
      text: 'Amazing service! I had old laptops and phones sitting around for years. The process was so simple, and I felt good knowing they were recycled responsibly.',
    },
    {
      name: 'Michael Chen',
      role: 'Small Business Owner',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      rating: 5,
      text: 'Perfect for our office upgrade. We disposed of 20+ computers hassle-free. The recycler was professional, and pickup was right on schedule.',
    },
    {
      name: 'Priya Sharma',
      role: 'Environmental Activist',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      rating: 5,
      text: 'Finally, a platform that makes e-waste recycling accessible! The transparency and tracking features are excellent. Highly recommended!',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-brand-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-brand-olive mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-brand-gray-medium max-w-2xl mx-auto">
            Real stories from people making a difference
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-brand-green/20">
                <FaQuoteLeft size={40} />
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-brand-green text-xl" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-brand-gray-medium mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full mr-4 bg-brand-light"
                />
                <div>
                  <h4 className="font-bold text-brand-black">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-brand-gray-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
