import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaRecycle, FaUsers, FaLeaf, FaTruck } from 'react-icons/fa'

const Statistics = () => {
  const [counters, setCounters] = useState({
    items: 0,
    users: 0,
    co2: 0,
    recyclers: 0,
  })

  const targets = {
    items: 50000,
    users: 10000,
    co2: 25000,
    recyclers: 500,
  }

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      setCounters({
        items: Math.floor((targets.items / steps) * step),
        users: Math.floor((targets.users / steps) * step),
        co2: Math.floor((targets.co2 / steps) * step),
        recyclers: Math.floor((targets.recyclers / steps) * step),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounters(targets)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      icon: FaRecycle,
      value: counters.items.toLocaleString(),
      label: 'Items Recycled',
      suffix: '+',
    },
    {
      icon: FaUsers,
      value: counters.users.toLocaleString(),
      label: 'Active Users',
      suffix: '+',
    },
    {
      icon: FaLeaf,
      value: counters.co2.toLocaleString(),
      label: 'Tons CO₂ Saved',
      suffix: '+',
    },
    {
      icon: FaTruck,
      value: counters.recyclers.toLocaleString(),
      label: 'Certified Recyclers',
      suffix: '+',
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-brand-green via-brand-olive to-brand-green relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Environmental Impact
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Together, we're making a real difference for our planet
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="text-center"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/30 transition-all duration-300 border border-white/30">
                <div className="flex justify-center mb-4">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                    <stat.icon className="text-3xl text-brand-green" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                  <span className="text-2xl">{stat.suffix}</span>
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-white/90 mb-6">
            Join us in creating a sustainable future, one device at a time
          </p>
          <button className="px-8 py-4 bg-white text-brand-green rounded-lg hover:bg-brand-light transition-all duration-300 font-semibold text-lg shadow-xl">
            Start Your Journey
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Statistics
