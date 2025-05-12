import React, { useState } from 'react';
import axios from '../axiosConfig';

function StoryReview({ story, onGenerateNew, onClose }) {
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0); // 0: neutral, 1: liked, -1: disliked
  const [isGenerating, setIsGenerating] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineInput, setShowDeclineInput] = useState(false);

  const handlePost = async () => {
    if (rating !== 1) {
      setError('You must like the story before posting to Facebook.');
      return;
    }
    try {
      setIsPosting(true);
      setError(null);
      const response = await axios.post('/facebook/post', { story_id: story.story_id }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error posting to Facebook');
    } finally {
      setIsPosting(false);
    }
  };

  const handleRate = async (newRating) => {
    try {
      if (newRating === -1) {
        setShowDeclineInput(true);
        return;
      }
      
      setIsGenerating(true);
      await axios.post('/story/rate', {
        story_id: story.story_id,
        rating: newRating
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setRating(newRating);
    } catch (error) {
      console.error('Error rating story:', error);
      setError(error.response?.data?.msg || 'Failed to rate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) {
      setError('Please provide a reason for declining the story.');
      return;
    }

    try {
      setIsGenerating(true);
      await axios.post('/story/rate', {
        story_id: story.story_id,
        rating: -1,
        decline_reason: declineReason
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRating(-1);
      await onGenerateNew(declineReason);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error rating story');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Your Story</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            {story.story}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {isGenerating && (
          <div className="flex justify-center items-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-4">
            <button
              onClick={() => handleRate(-1)}
              className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => handleRate(1)}
              className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Accept
            </button>
          </div>
          <button
            onClick={handlePost}
            disabled={isPosting || rating !== 1}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? 'Posting...' : 'Post to Facebook'}
          </button>
        </div>

        {showDeclineInput && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Why are you declining this story?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g., too many hashtags"
                className="flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
      <button
                onClick={handleDeclineSubmit}
                disabled={!declineReason.trim()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
                Submit
      </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryReview; 