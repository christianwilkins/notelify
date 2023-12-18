"use client";
import Image from "next/image";
import SideBar from "@/components/SideBar";
import React, { useEffect } from "react";

const bmcId = process.env.BMC_ID as string;
//if (bmcId == "") throw new Error("Buy me a coffee key not found");

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute("data-name", "BMC-Widget");
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
    script.setAttribute("data-id", bmcId);
    script.setAttribute("data-description", "Thank you for your support!");
    script.setAttribute(
      "data-message",
      "This website is free to use. Do you want to help support it?"
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
  }, []);

  return (
    <>
      <SideBar></SideBar>
      <main className="flex flex-col items-center justify-between p-24 bg-white">
        {/* <div className="h-full w-[15%] min-w-[20rem] absolute left-0 top-0 bg-gray-200"></div> */}

        <div>
          <h1 style={{ fontSize: "60px", fontWeight: "450" }}>
            GPT Finds Title
          </h1>
        </div>

        <button className="fixed bottom-5 right-5 h-12 w-12 rounded-full bg-gray-200 text-white"></button>

        <div className="bg-gray-200 fixed items-end flex h-1/32 w-1/4 left-100 top-5 text-white p-2.5 rounded-full">
          <button className="absolute right-5 top-1 h-3 w-3 rounded-full bg-orange-500 text-white"></button>
        </div>
      </main>
    </>
  );
}
