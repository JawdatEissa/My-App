import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

// impementation details separated
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long'),

   conversationId: z.string().uuid(),
});

//public interface
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);
      if (parseResult.success === false) {
         res.status(400).json(parseResult.error.format());
         return;
      }

      // grab Request body and destructure it to grab the prompt property
      // equivalent to const prompt = req.body.prompt;
      const { prompt, conversationId } = req.body;

      try {
         const response = await chatService.sendMessage(prompt, conversationId);

         //lastResponseID = responses.id;

         // return a json response to the client
         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({ error: 'Failed to generate a response' });
      }
   },
};
