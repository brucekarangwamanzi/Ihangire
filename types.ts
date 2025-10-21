
export interface BusinessIdea {
  name: string;
  concept: string;
  startupCost: 'Low' | 'Medium' | 'High' | string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
  web?: {
    uri: string;
    title: string;
  };
}