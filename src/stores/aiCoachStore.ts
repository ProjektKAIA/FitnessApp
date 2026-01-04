import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParsedConversation, ParsedMessage } from '@/services/ai';

export interface ImportedChat {
  id: string;
  title: string;
  importedAt: Date;
  messages: ParsedMessage[];
  extractedPlan?: string;
  isActive: boolean;
}

interface AICoachState {
  importedChats: ImportedChat[];
  activeChat: ImportedChat | null;
  isImporting: boolean;
  importError: string | null;

  // Actions
  addImportedChat: (conversation: ParsedConversation, extractedPlan?: string) => void;
  setActiveChat: (chatId: string) => void;
  removeChat: (chatId: string) => void;
  clearAllChats: () => void;
  setImporting: (isImporting: boolean) => void;
  setImportError: (error: string | null) => void;
}

export const useAICoachStore = create<AICoachState>()(
  persist(
    (set, get) => ({
      importedChats: [],
      activeChat: null,
      isImporting: false,
      importError: null,

      addImportedChat: (conversation, extractedPlan) => {
        const newChat: ImportedChat = {
          id: conversation.id,
          title: conversation.title,
          importedAt: new Date(),
          messages: conversation.messages,
          extractedPlan,
          isActive: false,
        };

        set((state) => {
          // Deactivate all other chats
          const updatedChats = state.importedChats.map((chat) => ({
            ...chat,
            isActive: false,
          }));

          // Add new chat as active
          newChat.isActive = true;

          return {
            importedChats: [newChat, ...updatedChats],
            activeChat: newChat,
          };
        });
      },

      setActiveChat: (chatId) => {
        set((state) => {
          const updatedChats = state.importedChats.map((chat) => ({
            ...chat,
            isActive: chat.id === chatId,
          }));

          const activeChat = updatedChats.find((chat) => chat.id === chatId) || null;

          return {
            importedChats: updatedChats,
            activeChat,
          };
        });
      },

      removeChat: (chatId) => {
        set((state) => {
          const updatedChats = state.importedChats.filter((chat) => chat.id !== chatId);
          const wasActive = state.activeChat?.id === chatId;

          return {
            importedChats: updatedChats,
            activeChat: wasActive ? null : state.activeChat,
          };
        });
      },

      clearAllChats: () => {
        set({
          importedChats: [],
          activeChat: null,
        });
      },

      setImporting: (isImporting) => {
        set({ isImporting });
      },

      setImportError: (error) => {
        set({ importError: error });
      },
    }),
    {
      name: 'ai-coach-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        importedChats: state.importedChats,
        activeChat: state.activeChat,
      }),
    }
  )
);
