import back from "../images/return.png";
import down from "../images/downfall.png";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useEffect } from "react";
import { categoryMapping } from "../components/Dropdown";
import { fetchWithAuth } from "../utils/api";

const History = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchTransactions();
    }
  }, [token, navigate]);

  const fetchTransactions = async () => {
    try {
      const data = await fetchWithAuth("/transactions");
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };
  const handleDelete = async () => {
    if (!selectedTransaction) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/transactions/${selectedTransaction.transaction_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        // Remove the deleted transaction from the state
        setTransactions((prev) =>
          prev.filter(
            (tx) => tx.transaction_id !== selectedTransaction.transaction_id
          )
        );
        setSelectedTransaction(null); // Close the modal
      } else {
        console.error("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const backSign = (e) => {
    e.preventDefault();
    navigate("/dash");
  };

  const handleItemClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const labels = Array.from(
    new Set(transactions.map((tx) => getDateLabel(tx.date)))
  );

  const renderTransactionsByDay = (label) => {
    const filtered = transactions.filter((t) => getDateLabel(t.date) === label);

    return filtered.map((item) => {
      const map = categoryMapping[item.category.toLowerCase()];
      const label = map ?.label;
      const icon = map?.icon;
      const bgColor = map?.bgColor;
      const textColor = item.type === "income" ? "#42AB39" : "#FD3C4A";

      return (
        <div
          key={item.transaction_id}
          className="flex items-center justify-between bg-[#FCFCFC]  p-4 rounded-[24px] w-[335px] h-[89px] mx-[20px] mb-[6px] cursor-pointer"
          onClick={() => handleItemClick({ ...item, icon, bgColor, textColor, label })}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-[60px] h-[60px] rounded-[16px] flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <img
                src={icon}
                className="w-10 h-10 object-contain"
                alt={item.category}
              />
            </div>
            <div>
              <p className="font-medium text-[16px] mb-[12px]">
                {map?.label || item.category}
              </p>
              <p className="text-[#91919F] text-[13px]">{item.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p
              className="text-[16px] font-semibold mb-[12px]"
              style={{ color: textColor }}
            >
              {item.type === "income"
                ? `+ Rp ${item.amount.toLocaleString("id-ID")}`
                : `- Rp ${item.amount.toLocaleString("id-ID")}`}
            </p>
            <p className="text-[#91919F] text-[13px]">
              {new Date(item.date).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      );
    });
  };

  if (!token) return null;

  return (
    <div className="w-[100dvw] h-[100dvh] max-h-[812px]">
      {/* Header */}
      <div className="w-[100dvw] h-[64px] mt-[44px] flex relative">
        <div className="w-[337px] h-[40px] flex items-center justify-between mx-[20px]">
          <span
            className="absolute left-[20px] flex items-center justify-center"
            onClick={backSign}
          >
            <div className="w-[32px] h-[32px] flex items-center justify-center">
              <img src={back} alt="Back" className="w-[24px]" />
            </div>
          </span>
          <span className="flex items-center justify-center w-full">
            <button className="text-[14px] w-[107px] h-[40px] bg-transparent border border-[#F1F1FA] rounded-[40px] font-medium flex items-center justify-center">
              <div className="w-[24px] h-[24px] flex items-center justify-center mt-[1px]">
                <img src={down} className="mr-[6px] my-2" alt="Month" />
              </div>
              <p>May</p>
            </button>
          </span>
        </div>
      </div>

      {/* Sections */}
      {labels.map((label) => (
        <React.Fragment key={label}>
          <div className=" mt-[20px] ml-[20px] flex">
            <p className="font-semibold text-[18px] mb-[8px]">{label}</p>
          </div>
          <div className="flex flex-col">{renderTransactionsByDay(label)}</div>
        </React.Fragment>
      ))}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/20 z-50 flex justify-center items-end">
          <div
            className="w-[375px] h-[650px] rounded-t-[32px] relative"
            style={{ backgroundColor: selectedTransaction.bgColor }}
          >
            {/* Header */}
            <div className="w-[375px] h-[64px] mt-[24px] flex items-center relative">
              <div className="w-full flex justify-center items-center relative">
                <p className="font-semibold text-[18px] text-[#292B2D]">
                  Detail
                </p>
                <button
                  className="absolute right-4 text-[24px] font-bold text-[#292B2D]"
                  onClick={() => setSelectedTransaction(null)}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Icon and Title */}
            <div className="flex mt-[14px] ml-[16px] items-center">
              <div
                className="w-[60px] h-[60px] rounded-[16px] flex items-center justify-center"
                style={{ backgroundColor: selectedTransaction.bgColor }}
              >
                <img
                  src={selectedTransaction.icon}
                  className="w-10 h-10"
                  alt="Category"
                />
              </div>
              <p className="ml-[14px] font-semibold text-[24px]">
                {selectedTransaction.label}
              </p>
            </div>

            {/* Amount */}
            <div
              className="mt-[12px] ml-[16px] font-semibold text-[40px]"
              style={{ color: selectedTransaction.textColor }}
            >
              {selectedTransaction.type === "income"
                ? `+Rp ${selectedTransaction.amount * 1000}`
                : `-Rp ${selectedTransaction.amount * 1000}`}
            </div>

            {/* White Sheet */}
            <div className="absolute bottom-0 z-10 bg-white w-full h-[480px] rounded-t-[32px] flex flex-col">
              <div className="flex w-[343px] h-[74px] border border-[#F1F1FA] rounded-[16px] mt-[23px] mx-auto items-center">
                <div className="ml-[14px] font-[400]">
                  {selectedTransaction.description}
                </div>
              </div>
              <div className="flex w-[343px] h-[74px] border border-[#F1F1FA] rounded-[16px] mt-[9px] mx-auto items-center">
                <div className="ml-[14px] font-[400]">
                  {new Date(selectedTransaction.date).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full mt-auto mb-6 px-4 justify-between">
                <button
                  className="w-[160px] h-[56px] rounded-[16px] bg-[#FCAC12] text-white font-semibold text-[18px]"
                  onClick={() => {
                    navigate("/edit", {
                      state: {
                        transaction: selectedTransaction, // send full object
                      },
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-[160px] h-[56px] border-2 border-[#FA2F34] text-[#FA2F34] rounded-[16px] font-semibold text-[18px]"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
