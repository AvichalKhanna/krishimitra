import { motion } from "framer-motion";
import { Leaf, CloudSun, Cpu, Users, HeartHandshake } from "lucide-react";

export default function About() {
  return (
    <section className="w-full py-20 px-6 md:px-16 lg:px-24 bg-gradient-to-br from-white via-green-50 to-white font-poppins">
      {/* Hero */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
          About Krishi Mitra
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Empowering farmers with AI-driven insights, real-time weather updates,
          and modern farming tools for a sustainable future.
        </p>
      </motion.div>

      {/* Vision + Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <motion.div
          className="bg-green-50 rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-green-700 mb-4">Our Vision 🌱</h3>
          <p className="text-gray-700 leading-relaxed">
            To revolutionize agriculture with intelligent solutions that
            increase productivity, reduce risks, and ensure sustainability for
            every farmer—no matter where they are.
          </p>
        </motion.div>

        <motion.div
          className="bg-green-50 rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-green-700 mb-4">Our Mission 🌍</h3>
          <p className="text-gray-700 leading-relaxed">
            To provide farmers with personalized insights, real-time updates,
            and AI-driven tools that help optimize crop yields, monitor soil
            health, and make smart decisions for sustainable farming.
          </p>
        </motion.div>
      </div>



    </section>
  );
}
