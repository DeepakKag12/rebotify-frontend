import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaRecycle, FaLeaf, FaCheckCircle } from 'react-icons/fa'
import useAuthStore from '../../../store/authStore'

const HeroSection = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      switch (user?.userType) {
        case 'admin':
          navigate('/admin/dashboard')
          break
        case 'recycler':
          navigate('/recycler/dashboard')
          break
        case 'delivery-partner':
          navigate('/delivery-partner/dashboard')
          break
        default:
          navigate('/user/dashboard')
      }
    } else {
      navigate('/signup')
    }
  }

  const handleLearnMore = () => {
    const element = document.getElementById('how-it-works')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="pt-24 pb-16 bg-gradient-to-br from-brand-light via-white to-brand-light min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-brand-olive">Responsible</span>
              <br />
              <span className="text-brand-green">E-Waste Disposal</span>
              <br />
              <span className="text-brand-black">Made Simple</span>
            </h1>

            <p className="text-xl text-brand-gray-medium leading-relaxed">
              Connect with certified recyclers and make a positive impact on the environment. 
              Safely dispose of your electronic waste in just a few clicks.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLearnMore}
                className="px-8 py-4 border-2 border-brand-olive text-brand-olive rounded-lg hover:bg-brand-olive hover:text-white transition-all duration-300 font-semibold text-lg"
              >
                Learn More
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 grid grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-brand-green">50K+</div>
                <div className="text-sm text-brand-gray-medium">Items Recycled</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-brand-green">10K+</div>
                <div className="text-sm text-brand-gray-medium">Happy Users</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-brand-green">500+</div>
                <div className="text-sm text-brand-gray-medium">Recyclers</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-brand-green to-brand-olive rounded-3xl p-12 shadow-2xl">
              <div className="absolute top-6 right-6 bg-white rounded-full p-4 shadow-lg">
                <FaLeaf className="text-4xl text-brand-green" />
              </div>
              
              <div className="space-y-8 text-white">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-4">
                    <FaRecycle className="text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Safe Disposal</h3>
                    <p className="text-white/80">Certified recyclers</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-4">
                    <FaCheckCircle className="text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Easy Tracking</h3>
                    <p className="text-white/80">Monitor your items</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-lg italic">
                    "Join thousands of users making a difference. Your old electronics 
                    can have a new purpose."
                  </p>
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-brand-green-light rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-brand-olive-light rounded-full opacity-30 blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
