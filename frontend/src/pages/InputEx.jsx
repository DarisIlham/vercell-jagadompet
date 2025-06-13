import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import back from "../images/backw.png";
import downgray from "../images/greyarrow.png";
import calendar from "../images/calender.png";
import shopping from "../images/shopcat.png";
import food from "../images/foodcat.png";
import bills from "../images/billscat.png";
import transport from "../images/transportcat.png";
import game from "../images/entcat.png";
import other from "../images/category3.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Untuk styling kalender
import { useEffect } from "react";
import { fetchWithAuth } from "../utils/api";

const TransactionDetailPage = () => {
  const [amount, setAmount] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryImage, setSelectedCategoryImage] = useState("");
  const [selectedCategoryBg, setSelectedCategoryBg] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [category, setCategory] = useState("");
  const token = localStorage.getItem("token");
  const [description, setDescription] = useState("");
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState("");

  const navigate = useNavigate();
  const backSign = (e) => {
    e.preventDefault();
    navigate("/dash");
  };

  const handleAmountClick = () => {
    setIsEditing(true);
    setIsKeyboardOpen(true);
  };

  const handleAmountChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, "");
    let formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formattedValue);
  };

  const handleAmountBlur = () => {
    setIsEditing(false);
    setIsKeyboardOpen(false);
  };

  const handleCategoryClick = () => {
    setShowCategoryPopup(true);
  };

  const handleCategorySelect = (category, categoryImage, categoryBg) => {
    setSelectedCategory(category);
    setSelectedCategoryImage(categoryImage);
    setSelectedCategoryBg(categoryBg);
    setShowCategoryPopup(false);
    if (category === "food") {
      setCategory("Food & Beverages");
    } else {
      setCategory(category.charAt(0).toUpperCase() + category.slice(1));
    }
  };

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (date) => {
  if (date > new Date()) {
    setSelectedDate(new Date());
  } else {
    setSelectedDate(date);
  }
  setShowCalendar(false);
};

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const isButtonEnabled = amount && selectedCategory && selectedDate;
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="w-full min-h-screen bg-[#FA2F34] flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="w-full h-[64px] mt-[44px] flex items-center justify-center relative">
        <button className="absolute left-[20px]" onClick={backSign}>
          <img src={back} alt="Back" className="w-[24px] h-[24px]" />
        </button>
        <p className="font-semibold text-[18px] text-white">Expense</p>
      </div>

      {/* Amount Input */}
      <div className="flex flex-col mt-[40px] px-[26px]">
        <p className="font-semibold text-[18px] leading-[100%] text-white/80">
          How much?
        </p>
        <div
          className="mt-[12px] font-semibold text-[40px] text-white"
          onClick={handleAmountClick}
        >
          {isEditing ? (
            <input
              placeholder="Rp ..."
              type="text"
              value={amount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              autoFocus
              className="bg-transparent border-none text-[40px] text-white outline-none w-full"
            />
          ) : (
            `Rp ${amount}`
          )}
        </div>
      </div>

      {/* Content Bottom */}
      <div
        className={`absolute w-full bg-white rounded-t-[32px] mt-[250px] flex flex-col items-center transition-all duration-300 ${
          isKeyboardOpen ? "h-[562px]" : "h-[562px]"
        }`}
      >
        <div
          onClick={handleCategoryClick}
          value={category}
          onChange={handleCategoryChange}
          className="flex w-[343px]  h-[74px] border-[1px] text-[#91919F] border-[#F1F1FA] rounded-[16px] mt-[23px] items-center cursor-pointer"
        >
          <div className="flex ml-[14px] font-[400]">
            {selectedCategory ? (
              <div
                className={`flex items-center w-[343px]  rounded-[16px] border-transparent h-[74px] mx-[-16px] ${selectedCategoryBg}`}
                value={category}
              >
                <img
                  src={selectedCategoryImage}
                  alt={selectedCategory}
                  className="w-[40px] h-[40px] ml-[16px]"
                />
                <span className="text-[#292B2D] font-medium text-[16px]  ml-[8px]">
                  {selectedCategory === "food"
                    ? "Food & Beverages"
                    : selectedCategory}
                </span>
              </div>
            ) : (
              "Category"
            )}
          </div>
          <div className="flex w-[32px] h-[32px] ml-auto mr-[14px] items-center justify-center">
            <img src={downgray} alt="" />
          </div>
        </div>

        <div className="flex w-[343px]  h-[74px] border-[1px]   border-[#F1F1FA] rounded-[16px] mt-[16px] items-center">
          <div className="flex ml-[14px] font-[400] text-[#0D0E0F]">
            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-[#91919F]/200 border-none outline-none "
            />
          </div>
        </div>

        {/* Date Section with Calendar */}
        <div
          onClick={handleCalendarClick}
          className={`w-[343px] flex h-[74px] border-[1px] text-[#91919F] ${
            isKeyboardOpen ? "border-transparent" : "border-[#F1F1FA]"
          } rounded-[16px] mt-[16px] items-center`}
        >
          <div
            value={date}
            onChange={handleDateChange}
            max={todayStr}
            className="flex ml-[14px] items-center font-[400]"
          >
            {selectedDate ? (
              <span className="text-black">
                {selectedDate.toLocaleDateString()}
              </span>
            ) : (
              "Date"
            )}
          </div>
          <div className="flex w-[32px] h-[32px] ml-auto mr-[14px] items-center justify-center">
            <img src={calendar} alt="" />
          </div>
        </div>

        {/* Calendar Pop-up */}
        {showCalendar && (
          <div className="absolute z-50 mt-[10px] p-4 w-[343px] bg-white border-[1px] rounded-[16px] shadow-lg">
            <Calendar
              onChange={handleDateSelect}
              value={selectedDate || new Date()}
            />
          </div>
        )}

        {/* Button Add Income */}
        <div
          className={`w-full px-[16px] flex ${
            isKeyboardOpen ? "mt-[-73px]" : "mt-[160px]"
          }`}
        >
          <button
            className={`flex-1 h-[56px] rounded-[16px] text-white font-semibold text-[18px] ${
              isButtonEnabled ? "bg-[#FA2F34]" : "bg-[#AAAAAA]"
            }`}
            disabled={!isButtonEnabled}
            onClick={async () => {
              const numericAmount = parseInt(amount.replace(/\./g, ""), 10);

              const payload = {

                type: "expense",
                category: selectedCategory,
                amount: numericAmount,
                date: selectedDate,
                description: description,
              };

              try {
                const result = await fetchWithAuth("/transactions", {
                  method: "POST",
                  body: JSON.stringify(payload),
                });


                console.log("Transaction saved:", result);
                navigate("/dash");
              } catch (err) {
                console.error("Request failed:", err);
                alert(err.message);
              }
            }}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/*  Popup Category Selection */}
      {showCategoryPopup && (
        <div className="fixed inset-0 flex items-end justify-center bg-[#0D0E0F]/16 z-50">
          <div className="bg-white w-full max-w-[375px] rounded-t-[32px] pt-2 pb-[58px]">
            {/* Drag Indicator */}
            <div className="w-[40px] h-[4px] bg-[#D3BDFF] rounded-full mx-auto mb-4"></div>

            {/* List Category */}
            <div className="flex flex-col  px-4">
              <div
                onClick={() =>
                  handleCategorySelect("Shopping", shopping, "bg-[#FCEED4]")
                }
                className="flex w-[343px] pl-[8px] h-[74px] border-[1px] text-[#91919F]  border-[#F1F1FA] rounded-[16px] items-center"
              >
                <img src={shopping} />
                <span className="text-[#292B2D] text-[16px] font-medium flex ml-[15px]">
                  Shopping
                </span>
              </div>

              <div
                onClick={() =>
                  handleCategorySelect("food", food, "bg-[#FDD5D7]")
                }
                className="flex w-[343px] pl-[8px] h-[74px] border-[1px] text-[#91919F] border-[#F1F1FA] rounded-[16px]  mt-[16px] items-center"
              >
                <img src={food} />
                <span className="text-[#292B2D] text-[16px] font-medium flex ml-[15px]">
                  Food & Beverages
                </span>
              </div>

              <div
                onClick={() =>
                  handleCategorySelect("Subscription", bills, "bg-[#EEE5FF]")
                }
                className="flex w-[343px] pl-[8px] h-[74px] border-[1px] text-[#91919F] border-[#F1F1FA] rounded-[16px]  mt-[16px] items-center"
              >
                <img src={bills} />
                <span className="text-[#292B2D] text-[16px] font-medium flex ml-[15px]">
                  Subscription
                </span>
              </div>

              <div
                onClick={() =>
                  handleCategorySelect(
                    "Transportation",
                    transport,
                    "bg-[#D9EBFF]"
                  )
                }
                className="flex w-[343px] pl-[8px] h-[74px] border-[1px] text-[#91919F] border-[#F1F1FA] rounded-[16px]  mt-[16px] items-center"
              >
                <img src={transport} />
                <span className="text-[#292B2D] text-[16px] font-medium flex ml-[15px]">
                  Transportation
                </span>
              </div>

              <div
                onClick={() =>
                  handleCategorySelect("Entertainment", game, "bg-[#FFE0CB]")
                }
                className="flex w-[343px] pl-[8px] h-[74px] border-[1px] text-[#91919F] border-[#F1F1FA] rounded-[16px]  mt-[16px] items-center"
              >
                <img src={game} />
                <span className="text-[#292B2D] text-[16px] font-medium flex ml-[15px]">
                  Entertainment
                </span>
              </div>

              <div
                onClick={() =>
                  handleCategorySelect("Other", other, "bg-[#E8E8E8]")
                }
                className="flex w-[343px] pl-[8px] h-[74px] border-[1px] text-[#91919F] border-[#F1F1FA] rounded-[16px] mt-[16px]  items-center"
              >
                <img src={other} />
                <span className="text-[#292B2D] text-[16px] font-medium flex ml-[15px]">
                  Other
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetailPage;
