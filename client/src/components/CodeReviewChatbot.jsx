import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { FaMicrophone } from 'react-icons/fa';

const CodeReviewChatbot = ({ code }) => {  // lowercase 'code' to match parent
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const sendMessage = async () => {
    const messageToSend = code || "";  // fallback to empty string
    if (!messageToSend.trim()) return; // prevent errors

    const userMessage = { sender: 'You', text: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/gemini/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4 bg-white shadow-lg rounded-lg border border-gray-200">

      <div className="flex items-center gap-2 mt-3">   
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
        >
          AI Review
        </button>
      </div>

      <div className="h-[400px] overflow-y-auto bg-gray-50 border border-gray-200 rounded-md p-3 space-y-3 mt-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-3 py-2 rounded-md text-sm whitespace-pre-wrap leading-relaxed ${
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
          <div className="max-w-[80%] mr-auto bg-gray-200 text-gray-600 px-3 py-1.5 rounded-md text-sm italic">
            <strong>CodeReviewer 🤖:</strong> <span className="animate-pulse">Typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default CodeReviewChatbot;
