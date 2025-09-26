import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FaArrowUp } from 'react-icons/fa';

// Defines the structure of our form data (just a 'prompt' field).
export type FormData = {
   prompt: string;
};

// Defines the props (properties) that this component expects to receive from its parent.
interface ChatInputProps {
   onSubmit: (prompt: string) => Promise<void>;
}

/**
 * The ChatInput component.
 * This is a "dumb" component that just displays the form.
 * It gets all its logic and data from the parent component as props.
 */
const ChatInput = ({ onSubmit }: ChatInputProps) => {
   // useForm is now local to this component
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   // Handles form submission and keyboard shortcuts
   const handleFormSubmit = async (data: FormData) => {
      await onSubmit(data.prompt);
      reset({ prompt: '' });
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         handleSubmit(handleFormSubmit)();
         e.preventDefault();
      }
   };

   return (
      <form
         onSubmit={handleSubmit(handleFormSubmit)}
         onKeyDown={onKeyDown}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
         <textarea
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
            type="submit"
         >
            <FaArrowUp className="rounded-full w-9 h-9" />
         </Button>
      </form>
   );
};

export default ChatInput;
