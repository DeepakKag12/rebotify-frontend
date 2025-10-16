import Navbar from '../components/Navbar'
import HeroSection from '../sections/HeroSection'
import HowItWorks from '../sections/HowItWorks'
import WhyChooseUs from '../sections/WhyChooseUs'
import Services from '../sections/Services'
import Statistics from '../sections/Statistics'
import Testimonials from '../sections/Testimonials'
import CTASection from '../sections/CTASection'
import Footer from '../sections/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <WhyChooseUs />
      <Services />
      <Statistics />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  )
}

export default LandingPage
