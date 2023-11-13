import Image from "next/image";
import SideBar from "@/components/SideBar";

export default function Home() {
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
