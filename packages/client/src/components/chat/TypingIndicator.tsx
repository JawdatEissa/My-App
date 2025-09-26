// Defines the props for this component.
interface TypingIndicatorProps {
   isVisible: boolean;
}

/**
 * The TypingIndicator component.
 * It displays a simple animation to show that the bot is "typing".
 */
const TypingIndicator = ({ isVisible }: TypingIndicatorProps) => {
   // If 'isVisible' is false, we render nothing (null).
   if (!isVisible) return null;

   // If 'isVisible' is true, we render the animated dots.
   return (
      <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
         <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
         <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
         <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
      </div>
   );
};

export default TypingIndicator;
