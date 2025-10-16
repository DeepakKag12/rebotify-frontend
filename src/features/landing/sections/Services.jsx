import { motion } from 'framer-motion'
import { FaLaptop, FaMobileAlt, FaTv, FaPrint, FaBatteryFull, FaEllipsisH } from 'react-icons/fa'

const Services = () => {
  const categories = [
    {
      icon: FaLaptop,
      title: 'Computers & Laptops',
      description: 'Desktops, laptops, monitors',
    },
    {
      icon: FaMobileAlt,
      title: 'Mobile Phones & Tablets',
      description: 'Smartphones, tablets, accessories',
    },
    {
      icon: FaTv,
      title: 'Home Appliances',
      description: 'TVs, refrigerators, microwaves',
    },
    {
      icon: FaPrint,
      title: 'Office Equipment',
      description: 'Printers, scanners, copiers',
    },
    {
      icon: FaBatteryFull,
      title: 'Batteries & Cables',
      description: 'All types of batteries and wires',
    },
    {
      icon: FaEllipsisH,
      title: 'Others',
      description: 'Gaming consoles, cameras, etc.',
    },
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-brand-olive mb-4">
            What We Accept
          </h2>
          <p className="text-xl text-brand-gray-medium max-w-2xl mx-auto">
            We handle all types of electronic waste responsibly
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-brand-light to-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-brand-green"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-brand-green rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-lg">
                  <category.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-brand-black mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-brand-gray-medium">
                  {category.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg text-brand-gray-medium mb-6">
            Don't see your item? We accept most electronic devices!
          </p>
          <button className="px-8 py-4 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl">
            View Full List
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
