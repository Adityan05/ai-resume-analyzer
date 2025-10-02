/* app/components/LandingPage.jsx */
import HeroLottie from "@/components/HeroLottie"; // client component wrapping <Lottie/>
import GetStartedButton from "@/components/GetStartedButton";
export default function LandingPage() {
  return (
    <section
      className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row
                        items-center justify-between gap-10 px-6 py-20"
    >
      {/* copy block */}
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Analyze&nbsp;&amp; improve your résumé <br /> in seconds
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300">
          Our AI scores your resume and delivers targeted fixes so you land
          interviews faster.
        </p>
        <GetStartedButton />
        {/* <button
          className="mt-6 inline-flex items-center gap-2 rounded-full
                           bg-gray-900 dark:bg-white text-white dark:text-gray-900
                           px-6 py-3 text-lg font-medium shadow-md hover:shadow-lg transition"
        >
          Get started
          <span className="inline-block -rotate-45">➜</span>
        </button> */}
      </div>

      {/* illustration */}
      <div className="w-full md:w-1/2 flex justify-center ">
        {/* grew each breakpoint by +40 px */}
        <div className="w-[320px] md:w-[420px] lg:w-[460px]">
          <HeroLottie />
        </div>
      </div>
    </section>
  );
}
