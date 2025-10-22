// Test script to verify Supabase database connection
// Run this in browser console or as a test component

import { supabase } from '@/lib/supabaseClient';
import { ArtworkService, UserProfileService, StoreService } from '@/services/database';

export async function testDatabaseConnection() {
  console.log('🧪 Testing Supabase Database Connection...');
  
  try {
    // Test 1: Check Supabase connection
    console.log('1️⃣ Testing Supabase connection...');
    const { data, error } = await supabase.from('artwork_catalog').select('count');
    if (error) throw error;
    console.log('✅ Supabase connection successful');

    // Test 2: Test artwork catalog
    console.log('2️⃣ Testing artwork catalog...');
    const artworks = await ArtworkService.getAllArtworks();
    console.log(`✅ Found ${artworks.length} artworks in catalog`);

    // Test 3: Test user profiles
    console.log('3️⃣ Testing user profiles...');
    const profiles = await UserProfileService.getAllUserProfiles();
    console.log(`✅ Found ${profiles.length} user profiles`);

    // Test 4: Test store info
    console.log('4️⃣ Testing store information...');
    const stores = await StoreService.getAllStores();
    console.log(`✅ Found ${stores.length} stores`);

    // Test 5: Test artwork search
    console.log('5️⃣ Testing artwork search...');
    const modernArtworks = await ArtworkService.getArtworksByStyle('modern');
    console.log(`✅ Found ${modernArtworks.length} modern artworks`);

    console.log('🎉 All database tests passed!');
    return {
      success: true,
      stats: {
        artworks: artworks.length,
        profiles: profiles.length,
        stores: stores.length,
        modernArtworks: modernArtworks.length
      }
    };

  } catch (error) {
    console.error('❌ Database test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Sample usage in a React component:
export function DatabaseTestComponent() {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    const result = await testDatabaseConnection();
    setTestResult(result);
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Database Connection Test</h3>
      
      <button
        onClick={runTest}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Run Database Test'}
      </button>

      {testResult && (
        <div className="mt-4">
          {testResult.success ? (
            <div className="text-green-600">
              <p>✅ Database connection successful!</p>
              <div className="mt-2 text-sm">
                <p>Artworks: {testResult.stats.artworks}</p>
                <p>User Profiles: {testResult.stats.profiles}</p>
                <p>Stores: {testResult.stats.stores}</p>
                <p>Modern Artworks: {testResult.stats.modernArtworks}</p>
              </div>
            </div>
          ) : (
            <div className="text-red-600">
              <p>❌ Database test failed: {testResult.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
