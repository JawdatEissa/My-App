import React, { useEffect, useRef } from 'react';
import ReactMarkDown from 'react-markdown';

// Defines the structure of a single message object.
export type Message = {
   content: string;
   role: 'user' | 'bot';
};

// Defines the props that this component expects from its parent.
interface ChatMessagesProps {
   messages: Message[];
   //lastMessageRef: React.RefObject<HTMLDivElement | null>;
   onCopyMessage: (e: React.ClipboardEvent) => void;
}

/**
 * The ChatMessages component.
 * This component is responsible for displaying the list of chat messages.
 */
const ChatMessages = ({ messages, onCopyMessage }: ChatMessagesProps) => {
   // The ref and effect for auto-scrolling to the latest message
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   return (
      <div className="flex flex-col flex-1 gap-4 mb-10 overflow-y-auto">
         {messages.map((message, index) => (
            <div
               key={index}
               onCopy={onCopyMessage}
               // The ref to scroll to the last message
               ref={index === messages.length - 1 ? lastMessageRef : null}
               className={`px-3 py-1 max-w-md rounded-xl ${
                  message.role === 'user'
                     ? 'bg-blue-600 text-white self-end'
                     : 'bg-gray-100 text-black self-start'
               }`}
            >
               <ReactMarkDown>{message.content}</ReactMarkDown>
            </div>
         ))}
      </div>
   );
};

export default ChatMessages;
