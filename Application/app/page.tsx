"use client";
// import ProjectImages from "@/app/projects/mokse/assets/index";
import Image from "next/image";
// import fs from "fs";
// import path from "path";
import { useState } from "react";
export default function Home() {
  const createDiscordThread = async () => {
    const response = await fetch("/api/discord/POST", {
      method: "POST",
    });
    const text = await response.text();
    alert(text);
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const filePath = path.join(
  //   process.cwd(),
  //   "app",
  //   "projects",
  //   "mokse",
  //   "MOKSE-3-180x46.webp"
  // );
  // const fileBuffer = fs.readFileSync(filePath);

  return (
    <>
      To send create a thread on Discord, press the button below.
      <fieldset className="mb-4 text-lg font-medium text-black dark:text-zinc-50">
        <legend>Welcome to CUSocialHub!</legend>
        <p className="max-w-md text-black dark:text-zinc-50">
          This is the home page of CUSocialHub. Click the button below to send a
          message to our Discord channel and create a new thread.
        </p>
        <div style={{ border: "1px solid white" }}>
          <label htmlFor="ice-cream-choice">Choose a Image:</label>
          <Image
            src={"/MOKSE-3-180x46.webp"}
            // src={ProjectImages["ice-cream.png"]}
            alt="Ice Cream"
            width={100}
            height={100}
          />

          {/* ////////////////////////// */}
          <input
            type={"search"}
            // list="ice-cream-flavors"
            // style={{ marginLeft: "10px" }}
            // onSelect={}
            // id="ice-cream-choice"
            // name="ice-cream-choice"
            // defaultValue="Choose your favorite ice cream flavor"
            // onChange={(e) => setSelectedImage(e.target.value)}
          ></input>
          <datalist id="ice-cream-flavors" style={{ width: 0 }}>
            {/* {ProjectImages &&
                    Object.entries(ProjectImages).map(([key, value]) => (
                      <option key={key} value={key} />
                    ))} */}
            <option value="Chocolate" />
            <option value="Vanilla" />
            <option value="Strawberry" />
            <option value="Mint Chocolate Chip" />
            <option value="Cookie Dough" />
          </datalist>
        </div>
      </fieldset>
      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        <button
          // className={"mt-4 rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 "}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          onClick={createDiscordThread}
        >
          Send Message to Discord
        </button>
      </div>
    </>
  );
}
