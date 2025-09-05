import { motion } from "framer-motion"
import { ArrowBigDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Hero() {
    const navigate = useNavigate();
    return (
        <>

        <section className="relative w-screen h-screen justify-between flex flex-col">

        <div className=""></div>

        <div className="flex flex-col justify-between items-center">

        <motion.div
            className="text-center mb-5 mt-20"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>

            <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
            Smart Farming Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time insights into soil, weather, and crop growth for better
            farming decisions.
            </p>

        </motion.div>

        <div className="flex gap-5">
            <button onClick={() => navigate("/home")} className="px-4 py-2 bg-black/80 rounded-xl font-semibold tracking-wide hover:bg-black/90 hover:scale-110 transition-all duration-300 ease-in-out">Login</button>
            <button onClick={() => navigate("/home")} className="px-4 py-2 bg-black/80 rounded-xl font-semibold tracking-wide hover:bg-black/90 hover:scale-110 transition-all duration-300 ease-in-out">Sign Up</button>
            <button onClick={() => navigate("/home")} className="px-4 py-2 bg-green-800/90 rounded-xl font-semibold tracking-wide hover:bg-green-800 hover:scale-110 transition-all duration-300 ease-in-out">Explore</button>
        </div>


        </div>


        <div className="">

    <div className="overflow-hidden whitespace-nowrap w-full mb-2">
      <div className="marquee inline-block text-black/60 text-lg">
        <span className="mx-16 font-bold">🚀 Soil Testing and Health Analysis</span>
        <span className="mx-16 font-bold">🔥 Real Time Updates and Threat Detection</span>
        <span className="mx-16 font-bold">💻 Always Adapting • Easy To Use • Mobile Friendly</span>
        <span className="mx-16 font-bold">🚀 Voice Activated Response</span>
        <span className="mx-16 font-bold">🔥 Zero Payment Required</span>
      </div>
    </div>

        </div>

    <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex flex-col justify-center items-center"
      >
        <p className="text-black/80 text-lg font-light">Scroll to know more</p>
        <ArrowBigDown className="text-black/50 w-8 h-8" />
      </motion.div>
    </div>

        </section>

        </>
    )
}