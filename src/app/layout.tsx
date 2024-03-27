import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SocketProvider } from "@/components/providers/socket-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nini chat",
  description: "A chat and video call collaboration app.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SocketProvider>
            <Toaster position="top-center" reverseOrder={true}/>
            <ModalProvider />
            <QueryProvider>
              {children}
            </QueryProvider>
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
