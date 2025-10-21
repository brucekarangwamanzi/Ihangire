import type { AppHistory, BusinessIdea, ChatMessage, SavedNameList } from '../types';

const getHistoryKey = (email: string) => `ihangire_history_${email}`;

const getInitialHistory = (): AppHistory => ({
  savedIdeas: [],
  savedNameLists: [],
  chatHistory: [],
});

export const getHistory = (email: string): AppHistory => {
  try {
    const savedHistory = localStorage.getItem(getHistoryKey(email));
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // Basic validation to ensure all keys exist
      return {
        savedIdeas: parsed.savedIdeas || [],
        savedNameLists: parsed.savedNameLists || [],
        chatHistory: parsed.chatHistory || [],
      };
    }
  } catch (error) {
    console.error('Failed to parse history from localStorage', error);
  }
  return getInitialHistory();
};

const saveHistory = (history: AppHistory, email: string) => {
  try {
    localStorage.setItem(getHistoryKey(email), JSON.stringify(history));
  } catch (error)
 {
    console.error('Failed to save history to localStorage', error);
  }
};

export const saveIdea = (idea: BusinessIdea, email: string) => {
  const history = getHistory(email);
  // Avoid duplicates
  if (!history.savedIdeas.some(i => i.name === idea.name && i.concept === idea.concept)) {
    history.savedIdeas.push(idea);
    saveHistory(history, email);
  }
};

export const saveNameList = (nameList: SavedNameList, email: string) => {
  const history = getHistory(email);
  // Avoid duplicates
  if (!history.savedNameLists.some(list => list.concept === nameList.concept)) {
    history.savedNameLists.push(nameList);
    saveHistory(history, email);
  }
};

export const saveChatHistory = (messages: ChatMessage[], email: string) => {
  const history = getHistory(email);
  history.chatHistory = messages;
  saveHistory(history, email);
};

export const isIdeaSaved = (idea: BusinessIdea, email: string): boolean => {
    const history = getHistory(email);
    return history.savedIdeas.some(i => i.name === idea.name && i.concept === idea.concept);
}
