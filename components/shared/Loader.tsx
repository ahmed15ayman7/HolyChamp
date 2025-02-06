import React from 'react'

const Loader = () => {
  return (
    <div
    className="w-full h-screen flex items-center justify-center bg-cover bg-center"
    // style={{
    //   backgroundImage: "url('/images/back.svg')", // Path to your background SVG
    //   backgroundSize: "cover",
    //   backgroundPosition: "center",
    // }}
    dir="rtl" // Set the direction to RTL
  >
    {/* Spinner Container */}
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Circular Spinner with Gradient */}
      <div
        className="absolute border-8 border-transparent rounded-full w-full h-full animate-spin 
                      from-[#FFD700] via-[#FF8C00] to-[#FF6347] bg-gradient-to-r"
      ></div>

      {/* Logo Image (SVG) */}
      <img
        src="/images/الشعار فقط.svg" // Path to your logo SVG
        alt="Logo"
        className="w-16 h-16 z-10" // Keep the logo size fixed and ensure it's above the spinner
      />
    </div>
  </div>
  )
}

export default Loader