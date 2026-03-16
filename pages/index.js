import { useState } from 'react';
import Editor from '../components/Editor';
import Preview from '../components/Preview';

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateWebsite = async (prompt) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'কোথাও সমস্যা হয়েছে');
      
      setGeneratedCode(data.code);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <nav className="bg-white shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            🤖 AI ওয়েবসাইট বিল্ডার
          </h1>
          <p className="text-gray-600 mt-1">আপনার কথা বলুন, আমি ওয়েবসাইট বানিয়ে দিই</p>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* এডিটর সেকশন */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
            <Editor onGenerate={generateWebsite} loading={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* প্রিভিউ সেকশন */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
            <Preview code={generatedCode} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}