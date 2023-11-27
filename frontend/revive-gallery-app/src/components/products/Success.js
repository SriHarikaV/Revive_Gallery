import React from "react";
import "./success.css";
const Success = () => {
  return (
    <div className="body">
      <div className="container">
        <div className="printer-top"></div>

        <div className="paper-container">
          <div className="printer-bottom"></div>

          <div className="paper">
            <div className="main-contents">
              <div className="success-icon">&#10004;</div>
              <div className="success-title">Payment Complete</div>
              <div className="success-description">
                Thank you for completing the payment! You will shortly receive
                an email of your payment.
              </div>
              <div className="order-details">
                <div className="order-number-label">Transaction ID</div>
                <div className="order-number">
                  {Math.floor(1000000000 + Math.random() * 9000000000)}
                </div>
                <div className="complement">Thank You!</div>
              </div>
            </div>
            <div className="jagged-edge"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
