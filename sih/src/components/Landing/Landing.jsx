import Nav from '../Nav'
import Hero from '../Hero'
import Features from '../Features'
import Contact from '../Contact'
import About from '../About'

export default function Landing() {

    return (
  <>
    <div className='absolute top-0 left-0 w-full bg-white overflow-x-hidden'>

      <Nav/>
      <Hero/>
      <About/>
      <Features/>
      <Contact/>
    </div>

    </>
    )
}