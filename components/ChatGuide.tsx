import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { askPikminGuide } from '../services/geminiService';
import { ChatMessage, CollectionItem } from '../types';

interface ChatGuideProps {
    collection: CollectionItem[];
}

const ChatGuide: React.FC<ChatGuideProps> = ({ collection }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: '你好！我是你的皮克敏嚮導。 🌱\n我知道你目前的收藏進度，有任何問題都可以問我喔！',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Add user message
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', text: userText, timestamp: Date.now() }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Pass collection for context-aware answers
      const responseText = await askPikminGuide(userText, collection);
      setMessages(prev => [
        ...prev,
        { role: 'model', text: responseText, timestamp: Date.now() }
      ]);
    } catch (error) {
        // Error handled in service, but safety fallback
        setMessages(prev => [
            ...prev,
            { role: 'model', text: "抱歉，我的訊號有點不穩定... 請稍後再試。", timestamp: Date.now() }
        ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/40">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-xl border-b border-white/20 p-4 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mr-3 shadow-lg ring-2 ring-white/50">
            <Sparkles className="text-white" size={20} />
            </div>
            <div>
            <h2 className="text-gray-900 font-bold text-lg leading-tight">皮克敏嚮導</h2>
            <p className="text-gray-500 text-xs font-medium">AI Guide</p>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/30 backdrop-blur-sm">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse items-end' : 'flex-row items-end'}`}>
              
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mx-2 shadow-sm border border-white/50 ${msg.role === 'user' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {msg.role === 'user' ? <User size={14} className="text-white"/> : <Bot size={14} className="text-white"/>}
              </div>

              {/* Bubble */}
              <div 
                className={`px-4 py-3 text-sm leading-relaxed shadow-sm backdrop-blur-md border border-white/20 ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-2xl rounded-tr-none' 
                    : 'bg-white/80 text-gray-800 rounded-2xl rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full">
             <div className="flex flex-row max-w-[80%] items-end">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mx-2 shadow-sm border border-white/50">
                    <Bot size={14} className="text-white"/>
                </div>
                <div className="bg-white/80 p-4 rounded-2xl rounded-tl-none border border-white/20 shadow-sm flex items-center space-x-1.5 h-10">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/60 backdrop-blur-xl border-t border-white/40">
        <div className="flex items-center space-x-2 bg-white/70 rounded-full px-2 py-2 border border-white/50 shadow-inner focus-within:ring-2 focus-within:ring-blue-400/50 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 px-3 text-sm"
            placeholder="Ask anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            <Send size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatGuide;