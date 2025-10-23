'use client';

import { useState } from 'react';
import Link from "next/link";

export default function AISettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    aiModel: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
    responseLanguage: 'en',
    
    // Analysis Settings
    colorDetectionAccuracy: 0.9,
    styleRecognitionThreshold: 0.8,
    lightingAnalysisEnabled: true,
    roomTypeDetection: true,
    
    // Recommendation Settings
    maxRecommendations: 12,
    priceRangeMin: 50,
    priceRangeMax: 500,
    includeTrending: true,
    diversityFactor: 0.7,
    
    // Chat Settings
    chatHistoryRetention: 30,
    autoResponseEnabled: true,
    responseDelay: 1000,
    personalityMode: 'professional',
    
    // Feature Flags
    experimentalFeatures: false,
    betaRecommendations: false,
    advancedAnalytics: true,
    voiceQueryEnabled: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    console.log('Saving settings:', settings);
    // API call to save settings
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      console.log('Settings reset');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Configuration</h2>
          <p className="text-gray-600">Configure AI models, analysis parameters, and feature flags</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Categories</h3>
              <nav className="space-y-2">
                {[
                  { id: 'general', label: 'General', icon: '⚙️' },
                  { id: 'analysis', label: 'Analysis', icon: '🔍' },
                  { id: 'recommendations', label: 'Recommendations', icon: '🎯' },
                  { id: 'chat', label: 'Chat', icon: '💬' },
                  { id: 'flags', label: 'Feature Flags', icon: '🚩' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">General AI Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
                      <select
                        value={settings.aiModel}
                        onChange={(e) => handleSettingChange('aiModel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        <option value="claude-3">Claude 3</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Tokens: {settings.maxTokens}
                      </label>
                      <input
                        type="range"
                        min="500"
                        max="4000"
                        value={settings.maxTokens}
                        onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature: {settings.temperature}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response Language</label>
                      <select
                        value={settings.responseLanguage}
                        onChange={(e) => handleSettingChange('responseLanguage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Settings */}
              {activeTab === 'analysis' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Analysis Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Detection Accuracy: {(settings.colorDetectionAccuracy * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1"
                        step="0.05"
                        value={settings.colorDetectionAccuracy}
                        onChange={(e) => handleSettingChange('colorDetectionAccuracy', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Style Recognition Threshold: {(settings.styleRecognitionThreshold * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1"
                        step="0.05"
                        value={settings.styleRecognitionThreshold}
                        onChange={(e) => handleSettingChange('styleRecognitionThreshold', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Lighting Analysis</h4>
                        <p className="text-sm text-gray-600">Enable automatic lighting detection</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.lightingAnalysisEnabled}
                          onChange={(e) => handleSettingChange('lightingAnalysisEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Room Type Detection</h4>
                        <p className="text-sm text-gray-600">Automatically detect room types</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.roomTypeDetection}
                          onChange={(e) => handleSettingChange('roomTypeDetection', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendation Settings */}
              {activeTab === 'recommendations' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommendation Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Recommendations: {settings.maxRecommendations}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="20"
                        value={settings.maxRecommendations}
                        onChange={(e) => handleSettingChange('maxRecommendations', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Min Price ($)</label>
                        <input
                          type="number"
                          value={settings.priceRangeMin}
                          onChange={(e) => handleSettingChange('priceRangeMin', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Price ($)</label>
                        <input
                          type="number"
                          value={settings.priceRangeMax}
                          onChange={(e) => handleSettingChange('priceRangeMax', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diversity Factor: {settings.diversityFactor}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.diversityFactor}
                        onChange={(e) => handleSettingChange('diversityFactor', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Include Trending Items</h4>
                        <p className="text-sm text-gray-600">Mix trending items with personalized recommendations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.includeTrending}
                          onChange={(e) => handleSettingChange('includeTrending', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Settings */}
              {activeTab === 'chat' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Chat Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chat History Retention (days): {settings.chatHistoryRetention}
                      </label>
                      <input
                        type="range"
                        min="7"
                        max="90"
                        value={settings.chatHistoryRetention}
                        onChange={(e) => handleSettingChange('chatHistoryRetention', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Response Delay (ms): {settings.responseDelay}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="3000"
                        step="100"
                        value={settings.responseDelay}
                        onChange={(e) => handleSettingChange('responseDelay', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Personality Mode</label>
                      <select
                        value={settings.personalityMode}
                        onChange={(e) => handleSettingChange('personalityMode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="casual">Casual</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Auto Response</h4>
                        <p className="text-sm text-gray-600">Enable automatic responses for common queries</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoResponseEnabled}
                          onChange={(e) => handleSettingChange('autoResponseEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature Flags */}
              {activeTab === 'flags' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Feature Flags</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Experimental Features</h4>
                        <p className="text-sm text-gray-600">Enable experimental AI features</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.experimentalFeatures}
                          onChange={(e) => handleSettingChange('experimentalFeatures', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Beta Recommendations</h4>
                        <p className="text-sm text-gray-600">Use beta recommendation algorithms</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.betaRecommendations}
                          onChange={(e) => handleSettingChange('betaRecommendations', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Advanced Analytics</h4>
                        <p className="text-sm text-gray-600">Enable detailed user analytics</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.advancedAnalytics}
                          onChange={(e) => handleSettingChange('advancedAnalytics', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Voice Query</h4>
                        <p className="text-sm text-gray-600">Enable voice input for queries</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.voiceQueryEnabled}
                          onChange={(e) => handleSettingChange('voiceQueryEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={resetSettings}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset to Default
                </button>
                <button
                  onClick={saveSettings}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
