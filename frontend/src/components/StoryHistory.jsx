import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function StoryHistory({ onClose }) {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('/story/history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStories(response.data.stories);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching story history');
      }
    };

    fetchStories();
  }, []);

  const getRatingIcon = (rating) => {
    switch (rating) {
      case 1:
        return (
          <span className="text-green-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </span>
        );
      case -1:
        return (
          <span className="text-red-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </span>
        );
      default:
        return (
          <span className="text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Story History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getRatingIcon(story.rating)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(story.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                {story.content}
              </p>
              {story.rating === -1 && story.decline_reason && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  <span className="font-medium">Declined because:</span> {story.decline_reason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoryHistory; 