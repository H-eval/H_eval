 import React from "react";
 

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="w-full bg-white shadow p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">My Website</h1>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center mt-10">
        <h2 className="text-4xl font-bold mb-4 text-blue-600">
          Welcome to My Website!
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          This is a simple homepage built with React and Tailwind CSS.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Get Started
        </button>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white p-4 text-center text-gray-500 mt-auto">
        &copy; 2025 My Website
      </footer>
    </div>
  );
};

export default Home;
