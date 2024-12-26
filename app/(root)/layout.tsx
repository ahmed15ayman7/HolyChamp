import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Header />
    <div className="min-h-[70vh]">
      
      {children}
    </div>
      <Footer />
    </div>
  );
}
