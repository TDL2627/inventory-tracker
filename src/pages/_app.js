import '../app/globals.css';
import Head from 'next/head';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Inventory Tracker</title>
        <meta name="description" content="Track your product inventory easily with our web app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/inventory.png" />
        <link rel="apple-touch-icon" href="/inventory.png" />
      </Head>
      <Navbar />
      {/* Main content */}
      <Component {...pageProps} />
      <Footer />
    </>
  )
}