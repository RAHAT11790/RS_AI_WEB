import { useState } from 'react';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Preview({ code, loading }) {
  const [view, setView] = useState('preview'); // 'preview' বা 'code'

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">আপনার ওয়েবসাইট তৈরি হচ্ছে...</p>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400 text-center">
        <div>
          <p className="text-6xl mb-4">🎨</p>
          <p>আপনার ওয়েবসাইট এখানে দেখা যাবে</p>
          <p className="text-sm mt-2">বাম পাশে আপনার আইডিয়া দিন</p>
        </div>
      </div>
    );
  }

  // কোড থেকে HTML এবং CSS আলাদা করা
  const extractHtmlAndCss = (fullCode) => {
    // যদি পুরো HTML ডকুমেন্ট হয়
    if (fullCode.includes('<!DOCTYPE html>')) {
      return fullCode;
    }
    
    // যদি React কম্পোনেন্ট হয়
    return fullCode;
  };

  const displayCode = extractHtmlAndCss(code);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('preview')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            view === 'preview' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          👁️ প্রিভিউ
        </button>
        <button
          onClick={() => setView('code')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            view === 'code' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 কোড
        </button>
      </div>

      {view === 'preview' ? (
        <div className="border rounded-xl p-4 bg-white min-h-[500px]">
          <LiveProvider code={displayCode} scope={{ useState }}>
            <LivePreview className="prose max-w-none" />
            <LiveError className="text-red-500 mt-2" />
          </LiveProvider>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <SyntaxHighlighter 
            language="html" 
            style={vscDarkPlus}
            className="text-sm"
          >
            {displayCode}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}