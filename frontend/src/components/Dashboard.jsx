import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import StoryReview from './StoryReview';
import StoryHistory from './StoryHistory';

function Dashboard() {
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const generateStory = async (declineReason = '') => {
    try {
      setIsGenerating(true);
      setError(null);
      const response = await axios.post('/story/generate', { decline_reason: declineReason }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCurrentStory(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error generating story');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-fixed bg-no-repeat bg-cover">
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              PostPilot AI
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => generateStory()}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isGenerating ? 'Generating...' : 'Generate New Story'}
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-700"
            >
              Show Story History
            </button>
          </div>

          {isGenerating && (
            <div className="flex justify-center items-center mb-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {currentStory && (
            <StoryReview
              story={currentStory}
              onGenerateNew={generateStory}
              onClose={() => setCurrentStory(null)}
            />
          )}

          {showHistory && (
            <StoryHistory onClose={() => setShowHistory(false)} />
          )}
        </div>
      </main>

      <footer className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} PostPilot AI. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
      </div>
      </footer>
    </div>
  );
}

export default Dashboard; 