import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import ReactMarkDown from 'react-markdown';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // reference to the form element
   // whenever the messages array changes , we scroll down to show the latest message
   const lastMessageRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const conversationID = useRef(crypto.randomUUID());

   // useForm initializes the form controller and provides helper methods
   // FormData defines the shape of form data in this case it has a single field 'prompt' of type string
   // register: connects inputs to form state, handleSubmit: handles validation and submission
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   /**
    * onSubmit will be called with form data if validation passes
    * Handles the form submission for sending a chat prompt.
    * This function updates the local messages state with the new prompt,
    * resets the form, and sends the prompt along with the current conversation ID
    * to the backend API endpoint (`/api/chat`). The response from the API is logged to the console.
    *
    * @param {FormData} param0 - An object containing the user's chat prompt.
    * @returns {Promise<void>} A promise that resolves when the submission is complete.
    *
    * @remarks
    * - The function uses `setMessages` to append the new prompt to the existing messages.
    * - The form is reset after submission.
    * - The API call sends both the prompt and the current conversation ID.
    * - The response from the API is logged for debugging purposes.
    */
   //                  data.prompt
   const onSubmit = async ({ prompt }: FormData) => {
      // Add the user's prompt to the messages state by appending it to the existing list
      // this functional form of setState is preferred when the new state depends on the previous state
      // because it will update the latest state value
      try {
         setMessages((messages) => [
            ...messages,
            { content: prompt, role: 'user' },
         ]);
         setIsBotTyping(true);
         setError(''); // clear previous error

         reset({ prompt: '' }); // reset the form field to empty string after submission

         // <ChatResponse> specify the return type
         const { data } = await axios.post<ChatResponse>('/api/chat', {
            //prompt: data.prompt,
            prompt,
            conversationId: conversationID.current,
         });
         //console.log(data);
         //copy all existing messages and add new message at the end
         //
         setMessages((messages) => [
            ...messages,
            { content: data.message, role: 'bot' },
         ]);
         setIsBotTyping(false);
         //setMessages([...messages, data.messages]);
      } catch (error) {
         console.error(error);
         setError('Failed to generate a response. Please try again.');
      } finally {
         setIsBotTyping(false);
      }
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         handleSubmit(onSubmit)();
         //prevent new line on enter key
         e.preventDefault();
      }
   };

   const onCopyMessage = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-4 mb-10 overflow-y-auto">
            {messages.map((message, index) => (
               <div
                  key={index}
                  onCopy={onCopyMessage}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  className={`px-3 py-1 rounded-xl ${
                     message.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-100 text-black self-start'
                  }`}
               >
                  <ReactMarkDown>{message.content}</ReactMarkDown>
               </div>
            ))}
            {isBotTyping && (
               <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse "></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay: 0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay: 0.4s]"></div>
               </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <form
            // handleSubmit wraps onSubmit, performs validation, and passes form data
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               // register connects this textarea to the form state and validation
               {...register('prompt', {
                  required: true,
                  validate: (value) => value.trim().length > 0,
               })}
               autoFocus={true}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="ask anything..."
               maxLength={1000}
            />
            <Button
               disabled={!formState.isDirty || !formState.isValid}
               className="p-2 rounded-full"
            >
               <FaArrowUp className="rounded-full w-9 h-9" />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
