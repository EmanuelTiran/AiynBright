import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import Appbar from "@/components/Appbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
  title: "Create Emanuel & Josh",
  description: "Generated for optimitries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header />
        {children}
        {/* <Providers>
          <SighnInButton />

          {children}</Providers> */}
          {/* <Appbar/> */}
      </body>
    </html>
  );
}
