import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

const CodeReviewChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'You', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/gemini/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const htmlReply = marked.parse(data.reply);
      const botMessage = { sender: 'CodeReviewer 🤖', text: htmlReply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'CodeReviewer 🤖', text: '❌ Sorry, something went wrong.' }
      ]);
    }

    setIsTyping(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("❗ Your browser doesn't support Speech Recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onerror = (event) => {
      alert(`Voice input error: ${event.error}`);
    };
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        🧠 Code Review Assistant
      </h2>

      <div className="h-[500px] overflow-y-auto bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[85%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap leading-relaxed ${
              msg.sender === 'You'
                ? 'ml-auto bg-blue-100 text-blue-900'
                : 'mr-auto bg-gray-200 text-gray-800'
            }`}
          >
            <div className="font-semibold mb-1">{msg.sender}:</div>
            <div
              className="prose prose-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded font-mono"
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}

        {isTyping && (
          <div className="max-w-[85%] mr-auto bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm italic">
            <strong>CodeReviewer 🤖:</strong> <span className="animate-pulse">Typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <input
          type="text"
          value={input}
          placeholder="Ask for review, suggestions, or fixes..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Send
        </button>
        <button
          onClick={startListening}
          title="Voice Input 🎤"
          className="bg-gray-100 hover:bg-gray-200 text-lg px-3 py-2 rounded-lg"
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default CodeReviewChatbot;
