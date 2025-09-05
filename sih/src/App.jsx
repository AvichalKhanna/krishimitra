import { Routes, Route } from "react-router-dom"
import "./App.css"
import Landing from "./components/Landing/Landing"
import Home from "./components/Dashboard/Home"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </>
  )
}