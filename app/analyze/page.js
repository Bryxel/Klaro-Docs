"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remainingAttempts, setRemainingAttempts] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 429) {
        throw new Error(data.error || 'Rate limit exceeded');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze document');
      }

      setResult(data);
      setRemainingAttempts(data.remaining);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8 sm:mb-12">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
          <div className="w-[100px] h-[50px] sm:w-[180px] sm:h-[90px] md:w-[240px] md:h-[120px] relative">
            <Image
              src="/logo.png"
              alt="Document Analyzer Logo"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100px, (max-width: 768px) 180px, 240px"
              priority
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleUpload}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Select your document
              </label>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                accept=".pdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
              />
            </div>
            
            {remainingAttempts !== null && (
              <div className="mb-4 text-sm text-gray-600">
                Remaining attempts today: {remainingAttempts}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={!file || loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
                font-medium text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : 'Analyze Document'}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-6 mb-8 text-red-700 bg-red-50 rounded-xl border border-red-200">
            <h3 className="font-semibold text-lg mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                <div className="text-3xl font-bold text-blue-600">
                  {result.score}/100
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Summary</h3>
                <p className="text-gray-700 leading-relaxed">{result.summary}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Suggestions</h3>
                <ul className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 