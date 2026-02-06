import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Marquee } from "../../../components/ui/marquee";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "https://avatar.iran.liara.run/public/girl",
      rating: 5,
      text: "Amazing service! I had old laptops and phones sitting around for years. The process was so simple, and I felt good knowing they were recycled responsibly.",
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      image: "https://avatar.iran.liara.run/public/boy",
      rating: 5,
      text: "Perfect for our office upgrade. We disposed of 20+ computers hassle-free. The recycler was professional, and pickup was right on schedule.",
    },
    {
      name: "Priya Sharma",
      role: "Environmental Activist",
      image: "https://avatar.iran.liara.run/public/girl",
      rating: 5,
      text: "Finally, a platform that makes e-waste recycling accessible! The transparency and tracking features are excellent. Highly recommended!",
    },
    {
      name: "David Williams",
      role: "Tech Enthusiast",
      image: "https://avatar.iran.liara.run/public/boy",
      rating: 5,
      text: "Best platform for responsible e-waste disposal. Quick, efficient, and eco-friendly. They made it incredibly easy to do the right thing!",
    },
    {
      name: "Emma Brown",
      role: "Student",
      image: "https://avatar.iran.liara.run/public/girl",
      rating: 5,
      text: "Used this to recycle my old devices before moving. The process was straightforward and I loved the environmental impact tracking!",
    },
    {
      name: "James Martinez",
      role: "IT Manager",
      image: "https://avatar.iran.liara.run/public/boy",
      rating: 5,
      text: "Fantastic service for corporate e-waste management. Secure data destruction and eco-friendly disposal. Couldn't ask for more!",
    },
  ];

  const firstRow = testimonials.slice(0, testimonials.length / 2);
  const secondRow = testimonials.slice(testimonials.length / 2);

  const ReviewCard = ({ image, name, role, text, rating }) => {
    return (
      <figure
        className={cn(
          "relative h-full w-96 cursor-pointer overflow-hidden rounded-2xl border p-6",
          "border-brand-green/20 bg-white hover:bg-brand-light/50 transition-all duration-300 hover:shadow-xl"
        )}
      >
        <div className="flex flex-row items-center gap-3 mb-4">
          <img
            className="rounded-full ring-2 ring-brand-green/20 object-cover"
            width="48"
            height="48"
            alt={name}
            src={image}
          />
          <div className="flex flex-col">
            <figcaption className="text-base font-bold text-brand-black">
              {name}
            </figcaption>
            <p className="text-sm font-medium text-brand-gray-medium">{role}</p>
          </div>
        </div>
        <div className="flex mb-3">
          {[...Array(rating)].map((_, i) => (
            <FaStar key={i} className="text-brand-green text-lg" />
          ))}
        </div>
        <blockquote className="text-sm text-brand-gray-medium leading-relaxed">
          "{text}"
        </blockquote>
      </figure>
    );
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-white via-brand-light/20 to-white relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-olive mb-3">
            What Our Users Say
          </h2>
          <p className="text-lg text-brand-gray-medium max-w-2xl mx-auto">
            Real stories from people making a difference
          </p>
        </motion.div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl py-4">
          <Marquee pauseOnHover className="[--duration:40s] [--gap:2.5rem]">
            {firstRow.map((review, idx) => (
              <ReviewCard key={`first-${idx}`} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:40s] [--gap:2.5rem] mt-4">
            {secondRow.map((review, idx) => (
              <ReviewCard key={`second-${idx}`} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[5%] bg-gradient-to-r from-white via-white/60 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[5%] bg-gradient-to-l from-white via-white/60 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
