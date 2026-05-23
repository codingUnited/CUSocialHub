"use client";

export default function Home() {
  const createDiscordThread = async () => {
    const response = await fetch("/api/discord/resources", {
      method: "POST",
    });
    const text = await response.text();
    alert(text);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To send create a thread on Discord, press the button below.
          </h1>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            // className={"mt-4 rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 "}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            onClick={createDiscordThread}
          >
            Send Message to Discord
          </button>
        </div>
      </main>
    </div>
  );
}
