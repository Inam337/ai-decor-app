'use client';

import { useState } from 'react';
import Link from "next/link";

export default function ChatHistoryPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const chatHistory = [
    {
      id: 1,
      user: 'john.doe@gmail.com',
      title: 'Living Room Design Consultation',
      lastMessage: 'What colors would work best with my gray walls?',
      timestamp: '2024-01-15 14:30',
      messageCount: 12,
      status: 'completed',
      tags: ['color-matching', 'living-room', 'modern']
    },
    {
      id: 2,
      user: 'sarah.smith@gmail.com',
      title: 'Artwork Recommendations',
      lastMessage: 'I love the abstract pieces you suggested!',
      timestamp: '2024-01-15 11:45',
      messageCount: 8,
      status: 'active',
      tags: ['abstract-art', 'recommendations']
    },
    {
      id: 3,
      user: 'mike.wilson@gmail.com',
      title: 'Budget Planning Session',
      lastMessage: 'What\'s the best option under $200?',
      timestamp: '2024-01-14 16:20',
      messageCount: 15,
      status: 'completed',
      tags: ['budget', 'pricing', 'affordable']
    },
    {
      id: 4,
      user: 'emma.brown@gmail.com',
      title: 'Bedroom Styling',
      lastMessage: 'The minimalist approach sounds perfect',
      timestamp: '2024-01-14 09:15',
      messageCount: 6,
      status: 'completed',
      tags: ['bedroom', 'minimalist', 'styling']
    },
    {
      id: 5,
      user: 'alex.johnson@gmail.com',
      title: 'Office Space Design',
      lastMessage: 'Can you help with productivity-focused decor?',
      timestamp: '2024-01-13 13:30',
      messageCount: 20,
      status: 'active',
      tags: ['office', 'productivity', 'professional']
    }
  ];

  const chatDetails = {
    1: {
      messages: [
        { id: 1, type: 'ai', text: 'Hello! I\'d be happy to help you design your living room. What style are you going for?', timestamp: '14:25' },
        { id: 2, type: 'user', text: 'I have gray walls and want something modern but cozy', timestamp: '14:26' },
        { id: 3, type: 'ai', text: 'Great choice! Gray walls are versatile. For a modern cozy look, I\'d suggest warm accent colors like deep blues, warm grays, or even muted golds.', timestamp: '14:27' },
        { id: 4, type: 'user', text: 'What about artwork? Any specific recommendations?', timestamp: '14:28' },
        { id: 5, type: 'ai', text: 'For your space, I\'d recommend abstract pieces with warm tones or geometric patterns. Would you like me to show you some specific options?', timestamp: '14:29' },
        { id: 6, type: 'user', text: 'What colors would work best with my gray walls?', timestamp: '14:30' }
      ],
      analysis: {
        roomType: 'Living Room',
        style: 'Modern Cozy',
        colorPalette: ['Gray', 'Deep Blue', 'Warm Gold'],
        recommendations: 5
      }
    }
  };

  const filteredChats = chatHistory.filter(chat => 
    chat.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Chat History</h2>
          <p className="text-gray-600">View and manage all AI conversations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === chat.id ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{chat.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        chat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {chat.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{chat.user}</p>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{chat.lastMessage}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      <span className="text-xs text-gray-500">{chat.messageCount} messages</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {chat.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {chat.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{chat.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Details */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {chatHistory.find(c => c.id === selectedChat)?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {chatHistory.find(c => c.id === selectedChat)?.user}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                      Export
                    </button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="space-y-4">
                    {chatDetails[selectedChat as keyof typeof chatDetails]?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Conversation Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Room Type:</span>
                        <span className="text-sm font-medium">{chatDetails[selectedChat as keyof typeof chatDetails]?.analysis.roomType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Style:</span>
                        <span className="text-sm font-medium">{chatDetails[selectedChat as keyof typeof chatDetails]?.analysis.style}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Recommendations:</span>
                        <span className="text-sm font-medium">{chatDetails[selectedChat as keyof typeof chatDetails]?.analysis.recommendations}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Color Palette</h4>
                    <div className="flex space-x-2">
                      {chatDetails[selectedChat as keyof typeof chatDetails]?.analysis.colorPalette.map((color, index) => (
                        <div key={index} className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">{color.charAt(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 20l1.338-3.123C2.493 15.767 2 13.013 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Conversation</h3>
                  <p className="text-gray-600">Choose a chat from the list to view details and messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
