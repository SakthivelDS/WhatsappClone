import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Sidebar from "./components/Sidebar.js";
// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whatsapp 2.0</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
    </div>
  )
}
