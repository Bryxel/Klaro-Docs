"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full flex items-center px-8 py-4 bg-transparent">
        <div className="flex items-center">
          <div style={{ width: '240px', height: '120px', position: 'relative' }}>
            <Image
              src="/logo.png"
              alt="Document Analyzer Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            One App to Score and Improve Your Job and School Documents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            From resumes and cover letters to essays and reports — get instant feedback, clear scores, and fixes that actually make a difference.
          </p>
          <Link 
            href="/analyze"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Try It Free — Upload Your Document
          </Link>
        </div>
        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What It Does</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
              <p className="text-gray-600">Upload your resume, cover letter, essay, or assignment</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Get Instant Scores</h3>
              <p className="text-gray-600">Instantly receive a score out of 100</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Detailed Summary</h3>
              <p className="text-gray-600">Get a concise summary of strengths and weaknesses</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">Actionable Suggestions</h3>
              <p className="text-gray-600">Follow specific suggestions to improve your writing</p>
            </div>
          </div>
        </div>
        {/* Target Audience Section */}
        <div className="py-16 bg-white rounded-2xl shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Who It's For</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">🎓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Students</h3>
                <p className="text-gray-600">Get actionable feedback to help you learn and grow as a writer. Understand your strengths and areas for improvement in every assignment.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-4xl">💼</div>
        <div>
                <h3 className="text-xl font-semibold mb-2">Job Seekers</h3>
                <p className="text-gray-600">Boost your application performance with professional feedback on your resumes and cover letters</p>
              </div>
            </div>
          </div>
        </div>
        {/* CTA Section */}
        <div className="text-center pb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Improve Your Documents?</h2>
          <Link 
            href="/analyze"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Try It Free — Upload Your Document
          </Link>
        </div>
    </main>
    </div>
  );
}
