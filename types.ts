
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

export interface SavedNameList {
  concept: string;
  names: string[];
}

export interface AppHistory {
  savedIdeas: BusinessIdea[];
  savedNameLists: SavedNameList[];
  chatHistory: ChatMessage[];
}

export interface User {
    email: string;
}
