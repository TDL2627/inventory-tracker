import "../app/globals.css";
import Head from "next/head";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>InStock</title>
        <meta
          name="description"
          content="Track your product inventory easily with our web app."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/inventory.png" />
        <link rel="apple-touch-icon" href="/inventory.png" />
      </Head>

      <Toaster position="top-center" reverseOrder={false} />

      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {/* Content area */}
        <div className="flex flex-1 lg:flex-row flex-col">
          <Navbar />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
        </div>

        {/* Footer always full width */}
        <Footer />
      </div>
    </>
  );
}
