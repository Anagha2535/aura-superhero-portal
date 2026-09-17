import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/TalkToAura.css';

function TalkToAura() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionData, setSessionData] = useState({ name: '', age: '', location: '', email: '', grievance: '' });
  const [onboardingStep, setOnboardingStep] = useState('WELCOME');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial Welcome
  useEffect(() => {
    if (onboardingStep === 'WELCOME' && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          { sender: 'aura', text: "Hi! I'm Aura ✨\nI'm really happy you're here. Before we start talking, I'd love to know a little about you.\n\nWhat should I call you? 😊", isOnboarding: true }
        ]);
        setIsTyping(false);
        setOnboardingStep('ASK_NAME');
      }, 1000);
    }
  }, [onboardingStep, messages.length]);

  const resetChat = () => {
    setMessages([]);
    setSessionData({ name: '', age: '', location: '', email: '', grievance: '' });
    setOnboardingStep('WELCOME');
    setIsSubmitting(false);
    setSubmissionComplete(false);
  };

  const callGeminiAPI = async (currentMessages, userContext) => {
    const systemInstruction = `You are Aura, the Heart-Bright Kid Hero.
You are a friendly, kind and curious companion.
Talk naturally like a close friend.
Remember the conversation context.
Use the user's name naturally when appropriate.
User Details: Name: ${userContext.name}, Age: ${userContext.age}, Location: ${userContext.location}.
Pay attention to emotional tone and respond with appropriate empathy.
Never claim to know exactly what someone feels.
Never diagnose mental-health conditions.
Do not repeatedly ask for information you already have.
Do not repeat the same response.
Respond specifically to what the user just said.
Keep conversations natural and engaging.
IMPORTANT: If the user shares ANY problem, grievance, negative emotion (like feeling stressed, sad, or overwhelmed), or explicitly asks for help, you MUST ALWAYS express understanding and offer to send their request/feelings to a human team who can support them. 
Whenever you offer to send their request, you MUST append exactly the string [SHOW_SUBMIT_BUTTON] at the very end of your response. Do not forget this tag!`;

    // Filter out onboarding messages
    const chatMessages = currentMessages.filter(msg => !msg.isOnboarding);
    
    // The last message is the one the user just sent
    if (chatMessages.length === 0) {
        throw new Error("No chat messages found to send.");
    }
    const latestUserMsg = chatMessages.pop();
    const latestMessage = latestUserMsg.text;

    const contents = chatMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await fetch(`/api/gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: systemInstruction,
        contents: contents,
        message: latestMessage
      })
    });

    if (!response.ok) {
      let errText = await response.text();
      try {
        const errObj = JSON.parse(errText);
        errText = errObj.error || errText;
      } catch (e) {
        // Not JSON
      }
      throw new Error(`API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.text;
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;

    // Add user message
    const isCurrentlyOnboarding = onboardingStep !== 'CHAT';
    const newMessages = [...messages, { sender: 'user', text, isOnboarding: isCurrentlyOnboarding }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    // Process based on state
    let auraReply = '';
    let nextStep = onboardingStep;
    let newSessionData = { ...sessionData };
    let showButton = false;

    try {
      if (onboardingStep === 'ASK_NAME') {
        newSessionData.name = text;
        auraReply = `Nice to meet you, ${text}! ✨\nHow old are you?`;
        nextStep = 'ASK_AGE';
      } else if (onboardingStep === 'ASK_AGE') {
        newSessionData.age = text;
        auraReply = `Where are you from? 🌎`;
        nextStep = 'ASK_LOCATION';
      } else if (onboardingStep === 'ASK_LOCATION') {
        newSessionData.location = text;
        auraReply = `And what's your email? I'd like to keep our conversation connected.`;
        nextStep = 'ASK_EMAIL';
      } else if (onboardingStep === 'ASK_EMAIL') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
          auraReply = "That doesn't look like a valid email address. Could you try again? ✨";
          nextStep = 'ASK_EMAIL';
        } else {
          newSessionData.email = text;
          auraReply = `Thanks for telling me about yourself, ${newSessionData.name}! ✨\nSo... tell me. How can I help?`;
          nextStep = 'CHAT';
        }
      } else {
        // AI Chat
        if (text) {
          newSessionData.grievance = newSessionData.grievance 
            ? newSessionData.grievance + '\n' + text 
            : text;
        }
        
        let geminiResponse = await callGeminiAPI(newMessages, newSessionData);
        if (geminiResponse.includes('[SHOW_SUBMIT_BUTTON]')) {
          geminiResponse = geminiResponse.replace(/\[SHOW_SUBMIT_BUTTON\]/g, '').trim();
          showButton = true;
        }
        auraReply = geminiResponse;
      }
    } catch (error) {
      console.error("Aura API Error:", error);
      auraReply = error.message.includes("API Error:") ? error.message : "Aura is having trouble connecting right now. Try again in a moment. ✨";
    }

    setSessionData(newSessionData);
    setOnboardingStep(nextStep);
    setMessages(prev => [...prev, { sender: 'aura', text: auraReply, isOnboarding: isCurrentlyOnboarding, isSubmitReady: showButton }]);
    setIsTyping(false);
  };

  const handleSubmitGrievance = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/send-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      
      if (!res.ok) {
         throw new Error("Failed to send grievance");
      }
      
      setSubmissionComplete(true);
      setMessages(prev => [...prev, { 
        sender: 'aura', 
        text: "Your request has been sent. ✨\nThank you for trusting Aura with this. 💛", 
        isOnboarding: false 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        sender: 'aura', 
        text: "Something went wrong while sending your request. ✨\nPlease try again in a moment.", 
        isOnboarding: false 
      }]);
    }
    setIsSubmitting(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Determine Aura's animation state
  let auraStateClass = '';
  if (isTyping) {
    auraStateClass = 'aura-thinking';
  } else if (messages.length > 0 && messages[messages.length - 1].sender === 'aura') {
    auraStateClass = 'aura-speaking';
  }

  return (
    <div className="talk-to-aura-page">
      {/* Back to Home Button */}
      <Link to="/" className="global-back-btn">
        <span className="back-arrow">←</span> BACK TO HOME
      </Link>

      <div className="chatbot-container">
        
        {/* Left Side: Aura Visual */}
        <div className={`aura-visual-side ${auraStateClass}`}>
          <div className="aura-character-wrapper">
            <img src="/assets/aura-hero-new.png" alt="Aura" className="aura-chat-img" />
            {/* Ambient Overlays */}
            <div className="chat-particles"></div>
            <div className="chat-aurora-glow"></div>
            <div className="chat-star-pulse"></div>
          </div>
        </div>

        {/* Right Side: Chat Interface */}
        <div className="chat-interface-side">
          <div className="chat-header">
            <div className="chat-header-avatar">✦</div>
            <div className="chat-header-info">
              <h2>Talk to Aura</h2>
              <span className="status-indicator">Online</span>
            </div>
            <button className="new-chat-btn" onClick={resetChat} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#AEBBC7', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem' }}>
              New Chat
            </button>
          </div>

          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-row ${msg.sender === 'aura' ? 'msg-left' : 'msg-right'}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                  {msg.isSubmitReady && !submissionComplete && (
                    <button 
                      className="submit-grievance-btn" 
                      onClick={handleSubmitGrievance}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending your request... ✨" : "✨ Send My Request"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message-row msg-left">
                <div className="chat-bubble aura typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <textarea
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              rows={1}
            />
            <button className="send-btn" onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default TalkToAura;
