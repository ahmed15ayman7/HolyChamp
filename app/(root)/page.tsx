"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@/interfaces";
import axios from "axios";
import HomeForm from "@/components/forms/HomeForm";
import { useQuery } from "@tanstack/react-query";

const LandingPage = () => {
  const [showMainPage, setShowMainPage] = useState(false);

  useEffect(() => {
    // Set the page to switch after 3 seconds
    const timer = setTimeout(() => {
      setShowMainPage(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (showMainPage) {
    return <MainPage />;
  }

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center"
      // style={{
      //   backgroundImage: "url('/images/back.svg')", // Path to your background SVG
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
      dir="rtl" // Set the direction to RTL
    >
      {/* Spinner Container */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Circular Spinner with Gradient */}
        <div
          className="absolute border-8 border-transparent rounded-full w-full h-full animate-spin 
                        from-[#FFD700] via-[#FF8C00] to-[#FF6347] bg-gradient-to-r"
        ></div>

        {/* Logo Image (SVG) */}
        <img
          src="/images/الشعار فقط.svg" // Path to your logo SVG
          alt="Logo"
          className="w-16 h-16 z-10" // Keep the logo size fixed and ensure it's above the spinner
        />
      </div>
    </div>
  );
};

const MainPage = () => {
  const [articles, setArticles] = useState<
    { id: string; title: string; content: string }[]
  >([]);
  const [user, setUser] = useState<User>();
  let getUser = async () => {
    let user = await getUserData();
    setUser(user);
  };
  let { data, isLoading, refetch } = useQuery<{ url: string; text: string }>({
    queryKey: ["home"],
    queryFn: async () => {
      let home = await axios.get("/api/home");
      return home.data[0];
    },
  });
  useEffect(() => {
    const fetchPendingArticles = async () => {
      try {
        // Fetch pending articles for men
        const menResponse = await axios.get("/api/articles?status=approved");
        setArticles(menResponse.data);
      } catch (error) {
        console.error("Failed to fetch approved articles:", error);
      }
    };

    fetchPendingArticles();
    getUser();
  }, []);
  let headding = "وخير جليس في الزمن كتاب",
    imageUrl = "/url.png";
  !isLoading && console.log(data);
  return (
    <div
      className="relative pb-48 overflow-hidden border-blue-500 max-w-full p-6  bg-[#FAF3E0] rounded-lg shadow-xl"
      dir="rtl"
    >
      {
        <span className="topbanner absolute top-0 right-0 w-full py-3 p-2  text-white rounded-bl-lg rounded-tr-lg"></span>
      }
      {
        <span className="topbanner absolute top-[98%] right-0 w-full py-3 p-2  text-white rounded-bl-lg rounded-tr-lg"></span>
      }
      {/* Header Section */}
      {/* <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#a5960a] leading-tight">
          الصفحة الرئيسية
        </h1>
        <p className="mt-3 text-lg text-[#4A4A4A] max-w-2xl mx-auto">
          مرحبًا بك في الموقع! اختر وجهتك المفضلة من هنا.
        </p>
      </header> */}

      {/* Articles or Announcements Section */}
      {
        <section className="grid grid-cols-12 gap-4 mb-20 px-20 max-sm:px-5 pt-8">
          <div className="md:col-span-6 md:justify-start col-span-12 text-center text-[50px]  flex justify-center items-center">
            <h1 className="text-[#a5960a]">
              {!isLoading && data?.text ? data.text : headding}
            </h1>
          </div>
          <div className=" relative col-span-12 md:col-span-4 md:col-start-8 md:justify-center flex justify-center">
            <div className=" w-full mt-4 top-1/2 -translate-y-1/2 absolute">
              <div className="h-6 rounded-s-full overflow-hidden -translate-x-10 animate-slideIn">
                <div
                  className="h-full bg-[#a5960a] "
                  style={{ width: "90%" }}
                ></div>
              </div>
              <div className="h-6 rounded-s-full overflow-hidden mt-12 animate-slideInDelayed">
                <div
                  className="h-full  bg-[#a5950a30] "
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>

            <img
              src={!isLoading && data?.url ? data.url : imageUrl}
              alt="صوره المصحف"
              className="w-100 h-60 z-10"
            />
          </div>
        </section>
      }

      {/* 
      {user && user?.role == "admin" && <HomeForm refetch={refetch} />}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-[#a5960a]">
          المقالات أو الإعلانات
        </h2>
        <div className="space-y-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white p-4  rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-[#a5960a]">
                {article.title}
              </h3>
              <p className="text-sm  text-[#4A4A4A] mt-3">{article.content}</p>
              <Link
                href={"/articles"}
                className="text-[#b6a43f] hover:underline mt-4 inline-block"
              >
                اقرأ المزيد
              </Link>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default LandingPage;
