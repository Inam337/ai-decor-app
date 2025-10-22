import Link from "next/link";

export default function ArtworkDetailPage({ params }: { params: { id: string } }) {
  const artwork = {
    id: params.id,
    title: "Abstract Harmony",
    price: "$129.99",
    rating: 5,
    reviews: 248,
    description: "This artwork perfectly complements your neutral gray walls with warm tones. The abstract design adds visual interest without overwhelming your minimalist aesthetic. The color palette harmonizes with your natural lighting, creating a balanced focal point for your living room."
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Art.Decor.AI</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/explore" className="text-gray-600 hover:text-gray-900">Explore</Link>
              <Link href="/trending" className="text-gray-600 hover:text-gray-900">Trending</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Artwork Display */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="h-96 bg-gradient-to-r from-purple-400 to-pink-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{artwork.title}</h2>
                    <p className="text-3xl font-bold text-purple-600">{artwork.price}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">({artwork.reviews} reviews)</span>
                  </div>
                </div>
                
                {/* Thumbnail Previews */}
                <div className="flex space-x-3 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Why This Matches Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex">
                <div className="w-1 bg-blue-400 rounded-full mr-4"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Why This Matches Your Room</h3>
                  <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-medium text-lg hover:opacity-90 transition-opacity">
                Add to Cart
              </button>
              <button className="w-full bg-white border-2 border-purple-500 text-purple-500 py-4 rounded-lg font-medium text-lg hover:bg-purple-50 transition-colors">
                Save for Later
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Details & Reasoning</h3>
              <p className="text-gray-600 mb-4">AI explanation and product details</p>
              <div className="text-sm text-gray-500 mb-6">
                Screen 4 of 6
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Color Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Purple and pink tones complement your neutral walls
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Style Match</h4>
                  <p className="text-sm text-gray-600">
                    Abstract design fits your modern aesthetic
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Size Recommendation</h4>
                  <p className="text-sm text-gray-600">
                    Perfect for your 8ft wall space
                  </p>
                </div>
              </div>
              
              <Link 
                href="/stores"
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-center block"
              >
                Find Nearby Stores →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
