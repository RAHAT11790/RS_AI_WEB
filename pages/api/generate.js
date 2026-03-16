export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'শুধুমাত্র POST অনুমোদিত' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'প্রম্প্ট দিন' });
  }

  // আপনি নিচের যেকোনো API ব্যবহার করতে পারেন
  const API_TYPE = 'GROQ'; // পরিবর্তন করুন: 'OPENAI', 'GEMINI', বা 'GROQ'

  try {
    let code;
    
    if (API_TYPE === 'GROQ') {
      code = await generateWithGroq(prompt);
    } else if (API_TYPE === 'OPENAI') {
      code = await generateWithOpenAI(prompt);
    } else if (API_TYPE === 'GEMINI') {
      code = await generateWithGemini(prompt);
    }

    res.status(200).json({ code });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'কোড জেনারেট করতে সমস্যা হয়েছে' });
  }
}

// Groq API (সেরা ফ্রি অপশন)
async function generateWithGroq(prompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'তুমি একজন ওয়েব ডেভেলপার। শুধুমাত্র HTML, CSS, এবং JavaScript কোড জেনারেট করো। কোডটি সম্পূর্ণ, রেস্পন্সিভ এবং আধুনিক হওয়া চাই। কোনো ব্যাখ্যা দিবে না, শুধু কোড দিবে। Tailwind CSS ব্যবহার করো।'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// OpenAI API
async function generateWithOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'তুমি একজন ওয়েব ডেভেলপার। শুধুমাত্র HTML, CSS, এবং JavaScript কোড জেনারেট করো।'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// Google Gemini API
async function generateWithGemini(prompt) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `তুমি একজন ওয়েব ডেভেলপার। "${prompt}" - এই নির্দেশনা অনুযায়ী একটি সম্পূর্ণ HTML ওয়েবসাইট বানাও। শুধু কোড দিবে, কোন ব্যাখ্যা নয়।`
        }]
      }]
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}