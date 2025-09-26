import { conversationRepository } from '../repositories/conversation.repository';
import OpenAI from 'openai';

//impementation detail
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type ChatResponse = {
   id: string;
   message: string;
};

//public interface
//Leaky abstraction
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: 'gpt-5-nano',
         input: prompt,
         //to establish a conversation with context/history
         previous_response_id:
            conversationRepository.getLastResponseID(conversationId),
         //max_output_tokens: 100,
      });

      conversationRepository.setLastResponseID(conversationId, response.id);

      // leaky abstraction resolved by not exposing the response to the client index.ts
      // also if we decide to change the AI provider in the future, we only need to change this file
      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
