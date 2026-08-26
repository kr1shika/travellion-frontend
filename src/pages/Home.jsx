import { useState } from 'react';
import heroBg from "../assets/bg.jpg"; // Replace with your actual image path
import Header from "../components/Header";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
    // You can navigate to search results page or filter content
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 drop-shadow-lg">
            Search Your Next Destination
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-3 sm:py-4 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#cd9d4e] text-sm sm:text-base shadow-lg"
              />
              <button
                type="submit"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#cd9d4e] hover:bg-[#b88d3e] text-white font-semibold rounded-lg sm:rounded-r-lg sm:rounded-l-none transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/*  */}
        </div>

        {/* Optional: Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Rest of your home content - You can add more sections below */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#253564] mb-12">
            Explore Our Tours
          </h2>
          {/* Add your tour cards or other content here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example cards - replace with your actual content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Tour Package 1</h3>
                <p className="text-gray-600 text-sm">Description here</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Tour Package 2</h3>
                <p className="text-gray-600 text-sm">Description here</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Tour Package 3</h3>
                <p className="text-gray-600 text-sm">Description here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;