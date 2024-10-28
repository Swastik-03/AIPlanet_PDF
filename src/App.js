import React, { useState, useEffect, useRef } from 'react';
import { uploadPDF, askQuestion } from './api';

export default function App() {
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [input, setInput] = useState('');  // User input for messages
  const [pdfName, setPdfName] = useState(''); // Name of the uploaded PDF
  const [pdfId, setPdfId] = useState(null); // ID of the uploaded PDF
  const [loading, setLoading] = useState(false); // Loading state for async operations
  const messageEndRef = useRef(null); // Ref to scroll to the latest message

   // Effect to load saved PDF info and messages from local storage
  useEffect(() => {
    const savedPdfId = localStorage.getItem('pdfId');
    const savedPdfName = localStorage.getItem('pdfName');
    const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];

    if (savedPdfId && savedPdfName) {
      setPdfId(savedPdfId);
      setPdfName(savedPdfName);
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    // Save PDF info and messages to localStorage
    localStorage.setItem('pdfId', pdfId || '');
    localStorage.setItem('pdfName', pdfName || '');
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [pdfId, pdfName, messages]);

  useEffect(() => {
    // Scroll to the latest message
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

   // Function to handle PDF file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await uploadPDF(file);
        if (response && response.pdf_id && response.filename) {
          // Set PDF name and ID, and clear previous messages on successful upload
          setPdfName(response.filename);
          setPdfId(response.pdf_id);
          setMessages([]);
        } else {
          alert('Upload failed: Invalid response from server.');
        }
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert('Upload failed. Please try again.');
      }
    }
  };

   // Function to send a message
  const handleSend = async () => {
    if (input.trim() && pdfId) {
      const userMessage = { sender: 'user', content: input, avatar: 'S' };
      setMessages([...messages, userMessage]);
      setInput(''); // Clear input
      setLoading(true); // Set loading state for AI response

      try {
        const response = await askQuestion(pdfId, input);
        if (response && response.pdf_id && response.answer) {
          // Add AI response message to chat
          const aiMessage = { sender: 'ai', content: response.answer };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } else {
          alert('Failed to retrieve answer.');
        }
      } catch (error) {
        console.error('Error fetching answer:', error);
        alert('PDF should have only 2000 Characters. Please upload different PDF');
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  const handleReset = () => {
    // Clear state and localStorage, reset the app
    setPdfName('');
    setPdfId(null);
    setMessages([]);
    setInput('');
    setLoading(false);
    localStorage.removeItem('pdfId');
    localStorage.removeItem('pdfName');
    localStorage.removeItem('messages');
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="shadow-lg flex items-center justify-between h-20 min-h-[80px] px-6 sm:px-12">
        <img
          src="/AI_Planet_Logo.png"
          alt="AI Planet Logo"
          className="h-8 sm:h-12 cursor-pointer"
          onClick={handleReset} // Reset on clicking logo
        />
        <div className="flex items-center gap-4 h-full">
          {pdfName && (
            <div className="flex items-center gap-2">
              <img src="/pdf.svg" alt="PDF icon" />
              <span
                className="text-sm sm:text-base font-medium text-green-600 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]"
                title={pdfName}
              >
                {pdfName}
              </span>
            </div>
          )}
          <label className="flex items-center justify-center h-10 w-10 sm:h-1/2 sm:w-48 border border-black rounded-lg font-inter font-semibold gap-2 sm:gap-5 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload} //Button for File Upload
            />
            <img src="/gala_add.svg" alt="Add icon" className="h-5" />
            <span className="hidden sm:block">Upload PDF</span>
          </label>
        </div>
      </header>

      <main className="flex-grow my-10 mb-20 mx-6 sm:mx-16 md:mx-32 overflow-y-auto scrollbar-hide">
        {messages.map((message, index) => (
          <div key={index} className="flex items-start space-x-4 mb-8 sm:mb-14">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white ${
                message.sender === 'user' ? 'bg-purple-400' : 'bg-green-400'
              }`}
            >
              {message.sender === 'user' ? (
                message.avatar
              ) : (
                <img src="/AI_logo.png" alt="AI Avatar" className="w-full h-full rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-gray-700 font-inter font-medium text-sm sm:text-base">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </main>

      <footer className="fixed bottom-12 left-0 right-0 mx-6 sm:mx-16 md:mx-32 font-inter font-medium">
        <div
          className={`relative ${pdfId ? 'shadow-lg rounded-lg' : ''}`}
          style={{
            boxShadow: pdfId ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
            border: pdfId ? '1px solid rgba(228, 232, 238, 1)' : 'none',
          }}
        >
          <input
            type="text"
            className={`w-full pr-20 py-4 px-4 sm:px-8 rounded-lg ${
              pdfId ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'
            }`}
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={!Boolean(pdfId)} //Enable Text input if pdf is uploaded
          />
          <button
            className="absolute right-4 sm:right-10 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent"
            onClick={handleSend}
            disabled={!Boolean(pdfId) || loading}  //Enable Text send if pdf is uploaded
          >
            {loading ? (
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div> //Loaded while we get response from Backend
            ) : (
              <img src="/iconoir_send.svg" className="h-6 w-6 sm:h-10 sm:w-10" alt="Send icon" />
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
