"use client";
import React, { useEffect } from "react";
import SideBar from "@/components/SideBar";
import Script from "next/script";

const buttonKey = process.env.HOSTED_BUTTON_ID || ""; // Retrieve the environment variable
//if (!buttonKey) throw new Error("PayPal key not found");
console.log("Button ID Key:", buttonKey); // Use the environment variable as needed

declare const window: any;

export default function Donation() {
  useEffect(() => {
    if (window.PayPal) {
      window.PayPal.Donation.Button({
        env: "sandbox",
        hosted_button_id: "HOSTED_BUTTON_ID",
        // business: 'YOUR_EMAIL_OR_PAYERID',
        image: {
          src: "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif",
          title: "PayPal - The safer, easier way to pay online!",
          alt: "Donate with PayPal button",
        },
        onComplete: function (params) {
          // Your onComplete handler
        },
      }).render("#paypal-donate-button-container");
    }
  }, []);

  const script = document.createElement("script");
  script.setAttribute("data-name", "BMC-Widget");
  script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
  script.setAttribute("data-id", "your-buymeacoffee-id");
  script.setAttribute("data-description", "Thank you for your support!");
  script.setAttribute(
    "data-message",
    "This web is free to use. Do you want to help supporting it?"
  );
  script.setAttribute("data-color", "#FF5F5F");
  script.setAttribute("data-position", "right");
  script.setAttribute("data-x_margin", "18");
  script.setAttribute("data-y-margin", "18");
  script.async = true;
  script.onload = function () {
    var evt = document.createEvent("Event");
    evt.initEvent("DOMContentLoaded", false, false);
    window.dispatchEvent(evt);
  };
  document.head.appendChild(script);

  return (
    <>
      <SideBar />
      <main className="flex flex-col items-center justify-between p-24 bg-white">
        <Script
          src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
          strategy="beforeInteractive"
        />
        <div>
          <h1 style={{ fontSize: "60px", fontWeight: "450" }}>
            Donate to Notelify
          </h1>
        </div>

        <form className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Donation Amount
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="number"
                placeholder="Enter amount"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Full Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-first-name"
                type="text"
                placeholder="Jane Doe"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="email"
                placeholder="jane.doe@example.com"
              />
            </div>
          </div>
          <div id="paypal-donate-button-container"></div>
        </form>
      </main>
    </>
  );
}
