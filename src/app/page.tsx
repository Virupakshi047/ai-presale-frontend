"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message sent!");
  };
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* <h1 className="text-2xl sm:text-3xl font-semibold text-blue-600">
            AI Powered Pre-Sales
             Automation
          </h1> */}
          <nav className="hidden md:flex space-x-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              Login as Admin
            </Link>
            <a
              href="#contact"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Request a Demo
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 mb-4"
            >
              Revolutionize Your Pre-Sales with AI
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 mb-8"
            >
              Prospects to Products, seamlessly
            </motion.p>
            <a
              href="#contact"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-100"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-600 mb-8">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  Requirement Analysis & Feature Breakdown
                </h3>
                <p className="text-gray-700">
                  Upload client requirements and let our AI extract key
                  functional and non-functional requirements, generating
                  detailed feature breakdowns automatically.
                </p>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  AI Business Analyst
                </h3>
                <p className="text-gray-700">
                  Our AI maps requirements to user personas, workflows, and
                  integrations, categorizing features into must-have,
                  nice-to-have, and future enhancements.
                </p>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  Architecture & Tech Stack Recommendation
                </h3>
                <p className="text-gray-700">
                  Get scalable architecture suggestions and third-party API
                  integrations based on your project requirements.
                </p>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  Effort Estimation & Cost Calculation
                </h3>
                <p className="text-gray-700">
                  Estimate development, testing, and DevOps efforts with
                  adjustable buffers, and calculate costs using standard pricing
                  models.
                </p>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  Wireframes & UI Mockups
                </h3>
                <p className="text-gray-700">
                  Automatically generate low-fidelity wireframes and UI mockups
                  based on extracted requirements.
                </p>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  Version Control & Collaboration
                </h3>
                <p className="text-gray-700">
                  Collaborate with your team in real-time, track changes, and
                  manage versions of your proposals.
                </p>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 mt-1">
                  Coming Soon
                </span>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <p className="text-gray-700">
                  {"Don&apos;t miss out on our powerful features"}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-600 mb-8">
              How It Works
            </h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    Step 1: Upload Requirements
                  </h3>
                  <p className="text-gray-700">
                    Users can upload client requirements via text input or
                    document upload (PDF, Word). Our AI supports various formats
                    to make the process seamless.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <Image
                    src="/images/input.jpg"
                    alt="Upload Requirements"
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    Step 2: AI Processing
                  </h3>
                  <p className="text-gray-700">
                    Our AI analyzes the requirements, generates feature
                    breakdowns, suggests scalable architecture, estimates
                    efforts and costs, and creates low-fidelity wireframes
                    automatically.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <Image
                    src="/images/aiimage.jpg"
                    alt="AI Processing"
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    Step 3: Review and Collaborate
                  </h3>
                  <p className="text-gray-700">
                    Review the AI-generated outputs, collaborate with your team
                    in real-time, track changes, and refine the proposal to meet
                    client expectations.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <Image
                    src="/images/collab.jpg"
                    alt="Review and Collaborate"
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-100"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-600 mb-8">
              Pricing Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    Starter
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Ideal for small businesses and startups.
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      $99
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                    <li>Up to 1,000 leads</li>
                    <li>Basic automation features</li>
                    <li>Email & chat support</li>
                  </ul>
                </div>
                <a
                  href="#contact"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  Get Started
                </a>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    Pro
                  </h3>
                  <p className="text-gray-700 mb-4">
                    For growing businesses with expanding teams.
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      $299
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                    <li>Up to 5,000 leads</li>
                    <li>Advanced automation features</li>
                    <li>Priority support</li>
                    <li>Collaboration tools</li>
                  </ul>
                </div>
                <a
                  href="#contact"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  Upgrade to Pro
                </a>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                    Enterprise
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Custom solutions for large enterprises.
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      Contact Us
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                    <li>Unlimited leads</li>
                    <li>Full feature suite</li>
                    <li>Dedicated account manager</li>
                    <li>Custom integrations</li>
                  </ul>
                </div>
                <a
                  href="#contact"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  Contact Sales
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-600 mb-8">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <p className="text-gray-700 mb-4 italic">
                  "This tool has streamlined our proposal process, saving us
                  countless hours and improving accuracy."
                </p>
                <p className="text-gray-900 font-semibold">
                  - Alex Johnson, Sales Manager
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <p className="text-gray-700 mb-4 italic">
                  "The AI-generated wireframes and cost estimations have been a
                  game-changer for our team."
                </p>
                <p className="text-gray-900 font-semibold">
                  - Sarah Lee, Project Lead
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-100"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-600 mb-8">
              Contact Us
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <form className="space-y-6" onSubmit={handleSendMessage}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your Message"
                    className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          © {new Date().getFullYear()} AI Powered Pre-Sales Automation. All
          rights reserved.
        </div>
      </footer>

      {/* Smooth Scrolling */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
