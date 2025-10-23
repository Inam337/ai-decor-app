'use client';

import Link from "next/link";

export default function AboutPage() {
  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      image: '/api/placeholder/200/200',
      bio: 'AI researcher with 10+ years in computer vision and machine learning.',
      linkedin: '#'
    },
    {
      name: 'Mike Johnson',
      role: 'CTO',
      image: '/api/placeholder/200/200',
      bio: 'Full-stack developer specializing in AI integration and scalable systems.',
      linkedin: '#'
    },
    {
      name: 'Emma Davis',
      role: 'Head of Design',
      image: '/api/placeholder/200/200',
      bio: 'Interior designer with expertise in color theory and spatial aesthetics.',
      linkedin: '#'
    },
    {
      name: 'Alex Rivera',
      role: 'AI Engineer',
      image: '/api/placeholder/200/200',
      bio: 'Machine learning engineer focused on computer vision and recommendation systems.',
      linkedin: '#'
    }
  ];

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Our advanced AI analyzes your room photos to understand colors, lighting, and style preferences.'
    },
    {
      icon: '🎨',
      title: 'Curated Artwork',
      description: 'Access thousands of hand-picked artworks from top artists and galleries worldwide.'
    },
    {
      icon: '💬',
      title: 'Personalized Chat',
      description: 'Chat with our AI stylist to get personalized recommendations and design advice.'
    },
    {
      icon: '🏪',
      title: 'Local Store Integration',
      description: 'Find and purchase recommended artwork from local stores near you.'
    },
    {
      icon: '📱',
      title: 'Multi-Platform',
      description: 'Upload photos, describe your style, or use voice commands - whatever works for you.'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data is secure and private. We never share your personal information.'
    }
  ];

  const stats = [
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Artwork Catalog', value: '500+' },
    { label: 'AI Recommendations', value: '1M+' },
    { label: 'Countries Served', value: '25+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Transforming Spaces with AI-Powered Art Recommendations
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              We combine cutting-edge artificial intelligence with interior design expertise to help you find the perfect artwork for your space.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
                <p className="text-lg text-gray-600 mb-6">
                  We believe that everyone deserves to live in a space that reflects their personality and brings them joy. 
                  Our AI-powered platform makes it easy to find artwork that perfectly complements your home.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  By combining computer vision, machine learning, and interior design expertise, we've created a system 
                  that understands your space and recommends artwork that will transform it into something truly special.
                </p>
                <div className="flex space-x-4">
                  <Link 
                    href="/upload-manager"
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link 
                    href="/explore"
                    className="bg-white border-2 border-purple-500 text-purple-500 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                  >
                    Explore Artwork
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Upload Your Room</h5>
                      <p className="text-sm text-gray-600">Take a photo of your space or describe your style preferences</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h5 className="font-semibold text-gray-900">AI Analysis</h5>
                      <p className="text-sm text-gray-600">Our AI analyzes colors, lighting, and style to understand your space</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Get Recommendations</h5>
                      <p className="text-sm text-gray-600">Receive personalized artwork suggestions with detailed explanations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Find & Purchase</h5>
                      <p className="text-sm text-gray-600">Locate nearby stores or purchase online with confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Art.Decor.AI?</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We combine the latest AI technology with human design expertise to deliver personalized recommendations you can trust.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're a diverse team of AI researchers, designers, and engineers passionate about making interior design accessible to everyone.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                  <a 
                    href={member.linkedin}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    LinkedIn →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Space?</h3>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found their perfect artwork with Art.Decor.AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/upload-manager"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/explore"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
              >
                Browse Artwork
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <h4 className="font-semibold">Art.Decor.AI</h4>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered artwork recommendations for your perfect space.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/explore" className="hover:text-white">Explore</Link></li>
                <li><Link href="/trending" className="hover:text-white">Trending</Link></li>
                <li><Link href="/upload-manager" className="hover:text-white">Upload</Link></li>
                <li><Link href="/chat" className="hover:text-white">AI Chat</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 Art.Decor.AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
