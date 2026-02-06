import { motion } from 'framer-motion'
import { FaLaptop, FaMobileAlt, FaTv, FaPrint, FaBatteryFull, FaEllipsisH } from 'react-icons/fa'
import { BentoGrid, BentoGridItem } from '../../../components/ui/bento-grid'

const Services = () => {
  const categories = [
    {
      icon: FaLaptop,
      title: 'Computers & Laptops',
      description: 'Desktops, laptops, monitors',
      image: '/images/laptop.webp',
    },
    {
      icon: FaMobileAlt,
      title: 'Mobile Phones & Tablets',
      description: 'Smartphones, tablets, accessories',
      image: '/images/mobile.jpg',
    },
    {
      icon: FaTv,
      title: 'Home Appliances',
      description: 'TVs, refrigerators, microwaves',
      image: '/images/homeappliances.jpg',
    },
    {
      icon: FaPrint,
      title: 'Office Equipment',
      description: 'Printers, scanners, copiers',
      image: '/images/office.jpeg',
    },
    {
      icon: FaBatteryFull,
      title: 'Batteries & Cables',
      description: 'All types of batteries and wires',
      image: '/images/batteries.jpeg',
    },
  ]

  const ImageHeader = ({ image, title }) => (
    <div className="flex flex-1 w-full h-36 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden items-center justify-center">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-contain p-3"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.className = 'flex flex-1 w-full h-36 rounded-xl bg-gradient-to-br from-brand-light to-brand-green/20';
        }}
      />
    </div>
  );

  return (
    <section id="services" className="py-16 md:py-20 bg-gradient-to-b from-white to-brand-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-olive mb-3">
            What We Accept
          </h2>
          <p className="text-lg text-brand-gray-medium max-w-2xl mx-auto">
            We handle all types of electronic waste responsibly
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <BentoGrid className="max-w-7xl mx-auto">
            {categories.slice(0, 3).map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={<ImageHeader image={item.image} title={item.title} />}
                icon={
                  <div className="bg-brand-green rounded-full w-10 h-10 flex items-center justify-center mb-2">
                    <item.icon className="text-xl text-white" />
                  </div>
                }
                className=""
              />
            ))}
          </BentoGrid>
          
          {/* Second row - centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-6">
            {categories.slice(3, 5).map((item, i) => (
              <BentoGridItem
                key={i + 3}
                title={item.title}
                description={item.description}
                header={<ImageHeader image={item.image} title={item.title} />}
                icon={
                  <div className="bg-brand-green rounded-full w-10 h-10 flex items-center justify-center mb-2">
                    <item.icon className="text-xl text-white" />
                  </div>
                }
                className=""
              />
            ))}
          </div>
        </motion.div>

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
