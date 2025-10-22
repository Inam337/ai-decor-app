import Link from "next/link";

export default function StoresPage() {
  const stores = [
    {
      id: 1,
      name: "Modern Art Gallery",
      distance: "0.8 mi",
      hours: "Open until 8 PM",
      status: "In Stock",
      statusColor: "bg-green-500"
    },
    {
      id: 2,
      name: "Design Hub Store",
      distance: "2.3 mi",
      hours: "Open until 6 PM",
      status: "Limited Stock",
      statusColor: "bg-yellow-500"
    },
    {
      id: 3,
      name: "Contemporary Frames",
      distance: "4.1 mi",
      hours: "Open until 7 PM",
      status: "In Stock",
      statusColor: "bg-green-500"
    }
  ];

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
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Available Near You</h2>
              <p className="text-gray-600">Found in 3 stores within 5 miles</p>
            </div>

            {/* Store Cards */}
            <div className="space-y-6">
              {stores.map((store) => (
                <div key={store.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {store.distance}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {store.hours}
                        </div>
                      </div>
                    </div>
                    <span className={`${store.statusColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {store.status}
                    </span>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors">
                      Get Directions
                    </button>
                    <button className="flex-1 bg-white border-2 border-purple-500 text-purple-500 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                      Call Store
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Section */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Store Locations</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p>Interactive map would be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Stores</h3>
              <p className="text-gray-600 mb-4">Nearby store locations and availability</p>
              <div className="text-sm text-gray-500 mb-6">
                Screen 5 of 6
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Stock Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-700">In Stock (2 stores)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-yellow-700">Limited Stock (1 store)</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Distance Range</h4>
                  <p className="text-sm text-blue-700">
                    All stores within 5 miles of your location
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Best Match</h4>
                  <p className="text-sm text-purple-700">
                    Modern Art Gallery - closest with full stock
                  </p>
                </div>
              </div>
              
              <Link 
                href="/chat"
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-center block"
              >
                Chat with AI →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
