import React, { useState } from "react";
import "./landingLight.css";
import Gamer from "../Gamer.png";
import CC3 from "../CC3.png";
import Payments from "../Payments.png";
import { IoIosArrowDown } from "react-icons/io";

const LandingLight = () => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="landing-light-container">
      <div className="landing-light-wrapper">

        {/*-------------- MENU SECTION ------------------ */}
        <div className="menu-wrapper">
          <div className={isMobile ? "mobile-menus" : "menus"}>
            <div className="menu" onMouseDown={(e) => e.preventDefault()}>
              TRIPS
            </div>
            <div className="menu" onMouseDown={(e) => e.preventDefault()}>
              RECENTLY VIEWED
            </div>
            <div className="menu" onMouseDown={(e) => e.preventDefault()}>
              BOOKINGS
            </div>
          </div>
          <div className="img-wrapper">
            <IoIosArrowDown
              className="dropdown-toggle"
              onClick={() => setIsMobile(!isMobile)}
              onBlur={() => setIsMobile(false)}
              tabIndex="0"
            />
            <img src={Gamer} alt="" />
          </div>
        </div>

        {/*------------ PAYMENT INFO SECTION ------------*/}
        <hr />
        <div className="payment-info">
          <div className="info-title-wrapper">
            <div className="title-wrapper">
              <div className="title">Payment Information</div>
              <div className="desc">Choose your method of payment</div>
            </div>
            <img src={Payments} alt="" />
          </div>
          <div className="form-and-card-wrapper">
            <div>
              <img src={CC3} alt="" />
            </div>
            <form action="">
              <div className="form-wrapper">
                <div className="input-wrapper">
                  <div>Credit card number</div>
                  <input placeholder="4324 5433 9382 1030" className="input" type="text" />
                </div>
                <div className="input-wrapper">
                  <div>Expiration date</div>
                  <input placeholder="03/24" className="input" type="text" />
                </div>
                <div className="input-wrapper">
                  <div>Security code</div>
                  <input placeholder="420" className="input" type="text" />
                </div>
                <div className="input-wrapper">
                  <div>Postal code</div>
                  <input placeholder="10119" className="input" type="text" />
                </div>
                <label class="radio-container">
                  <input className="radio-btn" type="radio" name="radio" />
                  Use this card for next time purchase
                </label>
              </div>
              <button>Add card</button>
            </form>
          </div>

          {/*------------ PAYMENT SUMMARY SECTION --------------*/}
          <hr />
          <div className="summary">
            <div className="summary-wrapper">
              <div className="summaryItem">
                <div className="summaryItemText">Subtotal:</div>
                <div className="summaryItemText">₦ 2,497.00</div>
              </div>
              <div className="summaryItem">
                <div className="summaryItemText">Estimated TAX:</div>
                <div className="summaryItemText">₦ 199.64</div>
              </div>
              <div className="summaryItem">
                <div className="summaryItemText">
                  Promotional Code: <span className="promo-code">Z4KXLM9A</span>{" "}
                </div>
                <div className="summaryItemText">₦ -60.00</div>
              </div>
            </div>
          </div>
          {/*--------------- TOTAL AMOUNT SECTION --------------*/}
          <hr />
          <div className="summaryItemTotal">
            <button>Complete payment</button>
            <div className="summaryItemTotalText">Total: ₦ 2556.64</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingLight;
