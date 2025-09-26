import React, { useState, useRef } from 'react';
// import { useForm } from 'react-hook-form';
import axios from 'axios';

import ChatInput from './ChatInput';
import ChatMessages, { type Message } from './ChatMessages';
import TypingIndicator from './TypingIndicator';

// This defines the expected structure of the response from the server.
type ChatResponse = {
   message: string;
};

// FormData type is now defined and used in ChatInput only.

/**
 * The main ChatBot component.
 * This component brings everything together and manages the chat's state and logic.
 */
const ChatBot = () => {
   // 'messages' holds the list of all chat messages (both user and bot).
   const [messages, setMessages] = useState<Message[]>([]);
   // 'isBotTyping' is a flag to show or hide the typing indicator.
   const [isBotTyping, setIsBotTyping] = useState(false);
   // 'error' stores any error message if the API call fails.
   const [error, setError] = useState<string | null>(null);

   // A ref to the last message element, used to auto-scroll the chat view.
   //const lastMessageRef = useRef<HTMLDivElement | null>(null);
   // A ref to store a unique ID for the entire conversation session.
   const conversationID = useRef(crypto.randomUUID());

   // This hook from 'react-hook-form' is now used in ChatInput, not here.

   /**
    * This function is called when the user submits the form (sends a message).
    * It handles the entire process of sending a message and getting a response.
    */
   const onSubmit = async (prompt: string): Promise<void> => {
      try {
         // 1. Add the user's new message to our list of messages.
         setMessages((prevMessages) => [
            ...prevMessages,
            { content: prompt, role: 'user' },
         ]);

         // 2. Show the typing indicator and clear any old errors.
         setIsBotTyping(true);
         setError(null);

         // 3. Clear the input field for the next message.
         // The input will be cleared by ChatInput's own useForm

         // 4. Send the user's message to the server API.
         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationID.current,
         });

         // 5. Add the bot's response to our list of messages.
         setMessages((prevMessages) => [
            ...prevMessages,
            { content: data.message, role: 'bot' },
         ]);
      } catch (error) {
         // If something goes wrong with the API call, show an error.
         console.error('Chat API Error:', error);
         setError('Failed to generate a response. Please try again.');
      } finally {
         // 6. No matter what, hide the typing indicator when we're done.
         setIsBotTyping(false);
      }
   };

   /**
    * This function listens for keyboard events on the form.
    * It allows the user to press 'Enter' to send a message.
    */
   // onKeyDown is now handled in ChatInput

   /**
    * This function allows the user to copy text from the chat messages.
    */
   const onCopyMessage = (e: React.ClipboardEvent): void => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   // This is what the component renders to the screen.
   return (
      <div className="flex flex-col h-full">
         {/* The component that displays all the chat messages. */}
         <ChatMessages messages={messages} onCopyMessage={onCopyMessage} />

         {/* The component that shows the "bot is typing" animation. */}
         {isBotTyping && <TypingIndicator isVisible={isBotTyping} />}
         {/* If there's an error, display it. */}
         {error && <p className="text-red-500">{error}</p>}

         {/* The component for the text input field and send button. */}
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
