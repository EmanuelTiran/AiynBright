import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import Appbar from "@/components/Appbar";

export const metadata = {
  title: "Create Emanuel & Josh",
  description: "Generated for optimitries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins">
        <Header />
        {children}
      </body>
    </html>
  );
}