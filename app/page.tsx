import { SendHorizonal } from "lucide-react";
import config from "@/config";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="container-6xl h-view flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 max-w-fit flex items-center justify-center space-x-2 overflow-hidden rounded-full border-2 border-gray-200 bg-white px-7 py-2 shadow-md transition-all backdrop-blur-md hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">
            {config.name} is now public!
          </p>
        </div>
        <h1 className="max-w-4xl">
          Chat with your <span className="text-primary">documents</span> in
          seconds!
        </h1>
        <p className="mt-5 max-w-prose text-zinc-500 sm:text-lg">
          {config.name} allows you to have conversation with any PDF document.
          Simply upload your file and start asking questions right away!
        </p>
        <ButtonLink
          href="/dashboard"
          size="lg"
          className="mt-5"
        >
          Start Chatting <SendHorizonal />
        </ButtonLink>
      </div>
      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-pink-600 to-violet-600 opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>
          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 p-2 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    className="rounded-md bg-white p-2 sm:p-4 md:p-8 shadow-2xl ring-1 ring-gray-900/10"
                    src="/dashboard-preview.jpg"
                    alt="Dashboard Preview"
                    width={1368}
                    height={866}
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-32 sm:mt-56 container-2xl">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="">Start chatting in minutes!</h2>
            <p className="mt-4 text-lg text-gray-600 text-center">
              Chatting to your PDF files has never been easier than before.
            </p>
          </div>
        </div>

        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">Step 1</span>
              <span className="text-xl font-semibold">
                Sign up for an account
              </span>
              <span className="mt-2 text-zinc-700">
                Either starting out with a free plan or choose our{" "}
                <Link href="/pricing">Pro Plan</Link>.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">Step 2</span>
              <span className="text-xl font-semibold">Upload you PDF file</span>
              <span className="mt-2 text-zinc-700">
                We&apos;ll process your file and make it ready for you to chat
                with.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-primary">Step 3</span>
              <span className="text-xl font-semibold">
                Start asking quesions
              </span>
              <span className="mt-2 text-zinc-700">It&apos;s that simple!</span>
            </div>
          </li>
        </ol>
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 p-2 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                className="rounded-md bg-white p-2 sm:p-4 md:p-8 shadow-2xl ring-1 ring-gray-900/10"
                src="/file-upload-preview.jpg"
                alt="File Uploading Preview"
                width={1419}
                height={732}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
