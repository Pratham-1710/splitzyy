import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calculator, Sparkles, Wallet, ArrowRight } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white/70 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Splitzy</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Split Expenses. <br /> Stay Friends. 💙
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            With <span className="font-semibold text-blue-600">Splitzy</span>, you can easily track shared expenses, split bills with friends or family, and settle up effortlessly.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
            <Users className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Groups
            </h3>
            <p className="text-gray-600">
              Create groups for trips, households, or events and keep expenses organized.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
            <Calculator className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Split Bills Fairly
            </h3>
            <p className="text-gray-600">
              Add expenses, and Splitzy will automatically calculate who owes what.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
            <Wallet className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Settle Up Easily
            </h3>
            <p className="text-gray-600">
              Get a clear picture of settlements so everyone stays stress-free.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Splitzy. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
