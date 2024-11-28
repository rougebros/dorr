import React, { useState } from "react";
import "./PaymentModal.css";
import { MdClose, MdDelete, MdAdd } from "react-icons/md";
import POVSelectorDDL from "./POVSelectorDDL";
import { useLocalization } from "../toolkit/LocalizationContext";

const PaymentModal = ({ onClose }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    { type: "Bank Account", details: "", pov: "self" },
  ]);
  const { translate } = useLocalization();

  const handleAddRow = () => {
    setPaymentMethods([
      ...paymentMethods,
      { type: "Select Payment Type", details: "", pov: "self" },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedMethods = [...paymentMethods];
    updatedMethods.splice(index, 1);
    setPaymentMethods(updatedMethods);
  };

  const handleInputChange = (index, key, value) => {
    const updatedMethods = [...paymentMethods];
    updatedMethods[index][key] = value;
    setPaymentMethods(updatedMethods);
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div
        className="payment-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-modal-header">
          <h2>{translate("201", "Payment Information")}</h2>
          <MdClose className="close-icon" onClick={onClose} />
        </div>
        <div className="payment-modal-body">
          {paymentMethods.map((method, index) => (
            <div key={index} className="payment-row">
              <select
                className="payment-type-dropdown"
                value={method.type}
                onChange={(e) =>
                  handleInputChange(index, "type", e.target.value)
                }
              >
                <option value="Bank Account">
                  {translate("202", "Bank Account")}
                </option>
                <option value="PayPal Account">
                  {translate("203", "PayPal Account")}
                </option>
                <option value="Binance Wallet">
                  {translate("204", "Binance Wallet")}
                </option>
                <option value="Other">{translate("205", "Other")}</option>
              </select>
              <input
                type="text"
                className="payment-details-input"
                placeholder={translate("206", "Enter details here...")}
                value={method.details}
                onChange={(e) =>
                  handleInputChange(index, "details", e.target.value)
                }
              />
              <POVSelectorDDL
                selectedPOV={method.pov}
                onPOVChange={(pov) => handleInputChange(index, "pov", pov)}
              />
              <MdDelete
                className="delete-icon"
                onClick={() => handleDeleteRow(index)}
              />
            </div>
          ))}
          <button className="add-more-button" onClick={handleAddRow}>
            <MdAdd className="add-icon" /> {translate("207", "Add More")}
          </button>
        </div>
        <div className="payment-modal-footer">
          <button className="modal-close-button" onClick={onClose}>
            {translate("208", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
