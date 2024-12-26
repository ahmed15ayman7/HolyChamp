export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" min-h-screen w-full" style={{ direction: "rtl" }}>
      {children}
      {/* <SocketComp/> */}
    </div>
  );
}
