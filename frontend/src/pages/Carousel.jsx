import React, { useEffect, useState } from "react";
import car1 from "../images/car1.png";
import car2 from "../images/car2.png";
import car3 from "../images/car3.png";
import { useNavigate } from "react-router-dom";


const Carousel = () => {
  const navigate = useNavigate();
  const images = [car1, car2, car3];

  const texts = [
    "Gain total control of your money",
    "Know where your money goes",
    "Planning ahead for your finance ",
  ];

  const caption = [
    "Become your own money manager and make every cent count",
    "Track your transaction easily,with categories and financial report",
    "Setup your budget for each category so you in control",
  ];


  const handleLogin = (e) => {
    navigate("/login");
  };

  const [index, setIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);



  return (
    <div className="relative w-full max-w-[375px] h-screen mx-auto">
      <div className="overflow-hidden rounded-lg">
        <img
          src={images[index]}
          alt={`Slide ${index + 1}`}
          className="w-[312px] h-[312px] mt-[76px] mx-[31px] object-cover"
        />
      </div>
      {/* Dynamic Text */}
      <div className="text-center mt-[41px] font-bold text-[32px] leading-[39px] mx-[49px]">
        {texts[index]} {/* Display corresponding text */}
      </div>
      <div className="text-center mt-[16px] text-[#91919F] font-medium text-[16px]  mx-[49px]">
        {caption[index]} {/* Display corresponding text */}
      </div>
      <div className="flex justify-center space-x-2 mt-[38px]">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === index ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
      {/* No button to transition */}
      <div className="w-full flex  justify-center mt-[38px]">
  
      </div>
      <div className="w-full flex justify-center mt-[16px]">
        <button
          type="submit"
          className="text-[18px]  bg-[#CCFFC8] hover:bg-white hover:text-black text-[#02791D] mb-[24px] w-[343px] h-[56px] py-[8px] px-[16px] gap-[10px] rounded-[16px] font-semibold"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Carousel;
