//impementation detail separated
// conversatoionID: provided by OpenAI
//conversatoionID -> lastresponseID
//conv1 ->100
//conv2 ->200

// to keep track of the last response ID for conversation history, but we need a map
//to track mutiple responses not just the last one
//let lastResponseID: string | null = null;
const conversations = new Map<string, string>();

export const conversationRepository = {
   getLastResponseID(conversationId: string) {
      return conversations.get(conversationId);
   },
   setLastResponseID(conversationId: string, responseId: string) {
      conversations.set(conversationId, responseId);
   },
};
