import Link from "next/link";

const Custom404: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
        <p className="mt-2 text-gray-500">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <a className="mt-6 inline-block px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600">
            Go Back Home
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
