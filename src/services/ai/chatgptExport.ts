import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import JSZip from 'jszip';

// ChatGPT Export Format Types
export interface ChatGPTMessage {
  id: string;
  author: {
    role: 'user' | 'assistant' | 'system' | 'tool';
    name?: string;
    metadata?: Record<string, unknown>;
  };
  create_time: number | null;
  update_time: number | null;
  content: {
    content_type: string;
    parts?: string[];
    text?: string;
  };
  status: string;
  end_turn?: boolean;
  weight?: number;
  metadata?: Record<string, unknown>;
  recipient?: string;
}

export interface ChatGPTMapping {
  id: string;
  message: ChatGPTMessage | null;
  parent: string | null;
  children: string[];
}

export interface ChatGPTConversation {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, ChatGPTMapping>;
  moderation_results: unknown[];
  current_node: string;
  plugin_ids?: string[] | null;
  conversation_id: string;
  conversation_template_id?: string | null;
  gizmo_id?: string | null;
  is_archived: boolean;
  safe_urls?: string[];
  default_model_slug?: string;
  id: string;
}

export interface ChatGPTExportData {
  conversations: ChatGPTConversation[];
}

// Parsed/Simplified format for our app
export interface ParsedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | null;
}

export interface ParsedConversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ParsedMessage[];
  messageCount: number;
  preview: string;
}

export interface ImportResult {
  success: boolean;
  conversations?: ParsedConversation[];
  error?: string;
}

const extractMessageContent = (message: ChatGPTMessage): string => {
  if (!message.content) return '';

  if (message.content.parts && message.content.parts.length > 0) {
    return message.content.parts.join('\n');
  }

  if (message.content.text) {
    return message.content.text;
  }

  return '';
};

const linearizeConversation = (conversation: ChatGPTConversation): ParsedMessage[] => {
  const messages: ParsedMessage[] = [];
  const mapping = conversation.mapping;

  // Find the root node (node with parent === null)
  let currentNodeId = conversation.current_node;
  const visitedNodes = new Set<string>();
  const messageChain: string[] = [];

  // Walk backwards from current_node to root to build the chain
  while (currentNodeId && !visitedNodes.has(currentNodeId)) {
    visitedNodes.add(currentNodeId);
    messageChain.unshift(currentNodeId);
    const node = mapping[currentNodeId];
    if (node?.parent) {
      currentNodeId = node.parent;
    } else {
      break;
    }
  }

  // Process messages in order
  for (const nodeId of messageChain) {
    const node = mapping[nodeId];
    if (!node?.message) continue;

    const msg = node.message;
    const role = msg.author?.role;

    // Only include user and assistant messages
    if (role !== 'user' && role !== 'assistant') continue;

    const content = extractMessageContent(msg);
    if (!content.trim()) continue;

    messages.push({
      id: msg.id,
      role: role as 'user' | 'assistant',
      content: content.trim(),
      timestamp: msg.create_time ? new Date(msg.create_time * 1000) : null,
    });
  }

  return messages;
};

const parseConversations = (data: ChatGPTExportData): ParsedConversation[] => {
  if (!data.conversations || !Array.isArray(data.conversations)) {
    return [];
  }

  return data.conversations
    .map((conv): ParsedConversation | null => {
      try {
        const messages = linearizeConversation(conv);

        if (messages.length === 0) return null;

        const firstUserMessage = messages.find(m => m.role === 'user');
        const preview = firstUserMessage?.content.slice(0, 100) || conv.title;

        return {
          id: conv.id || conv.conversation_id,
          title: conv.title || 'Untitled Conversation',
          createdAt: new Date(conv.create_time * 1000),
          updatedAt: new Date(conv.update_time * 1000),
          messages,
          messageCount: messages.length,
          preview: preview.length > 100 ? `${preview.slice(0, 97)}...` : preview,
        };
      } catch {
        return null;
      }
    })
    .filter((conv): conv is ParsedConversation => conv !== null)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

const readZipFile = async (uri: string): Promise<ChatGPTExportData | null> => {
  try {
    const base64Content = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });

    const zip = new JSZip();
    await zip.loadAsync(base64Content, { base64: true });

    // Look for conversations.json in the zip
    const conversationsFile = zip.file('conversations.json');
    if (!conversationsFile) {
      // Try to find it in any subdirectory
      const files = Object.keys(zip.files);
      const convFile = files.find(f => f.endsWith('conversations.json'));
      if (convFile) {
        const content = await zip.file(convFile)?.async('string');
        if (content) {
          return JSON.parse(content) as ChatGPTExportData;
        }
      }
      return null;
    }

    const content = await conversationsFile.async('string');
    return JSON.parse(content) as ChatGPTExportData;
  } catch (error) {
    console.error('Error reading ZIP file:', error);
    return null;
  }
};

const readJsonFile = async (uri: string): Promise<ChatGPTExportData | null> => {
  try {
    const content = await FileSystem.readAsStringAsync(uri);
    const data = JSON.parse(content);

    // Check if it's a direct conversations array or wrapped object
    if (Array.isArray(data)) {
      return { conversations: data };
    }

    return data as ChatGPTExportData;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
};

export const chatGPTExportService = {
  async pickAndImportFile(): Promise<ImportResult> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'application/zip', 'application/x-zip-compressed'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return { success: false, error: 'No file selected' };
      }

      const file = result.assets[0];
      const uri = file.uri;
      const fileName = file.name?.toLowerCase() || '';

      let exportData: ChatGPTExportData | null = null;

      if (fileName.endsWith('.zip')) {
        exportData = await readZipFile(uri);
      } else if (fileName.endsWith('.json')) {
        exportData = await readJsonFile(uri);
      } else {
        // Try both methods
        exportData = await readJsonFile(uri);
        if (!exportData?.conversations) {
          exportData = await readZipFile(uri);
        }
      }

      if (!exportData || !exportData.conversations) {
        return {
          success: false,
          error: 'Invalid file format. Please export your data from ChatGPT Settings → Data Controls → Export Data'
        };
      }

      const conversations = parseConversations(exportData);

      if (conversations.length === 0) {
        return {
          success: false,
          error: 'No conversations found in the export file'
        };
      }

      return { success: true, conversations };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import file',
      };
    }
  },

  filterFitnessConversations(conversations: ParsedConversation[]): ParsedConversation[] {
    const fitnessKeywords = [
      'workout', 'training', 'exercise', 'fitness', 'gym',
      'muscle', 'strength', 'cardio', 'routine', 'plan',
      'push', 'pull', 'legs', 'split', 'reps', 'sets',
      'weight', 'lifting', 'bodybuilding', 'crossfit',
      'hiit', 'yoga', 'stretch', 'mobility', 'recovery',
      'protein', 'diet', 'nutrition', 'bulk', 'cut',
      'trainingsplan', 'übung', 'muskel', 'kraft',
    ];

    return conversations.filter(conv => {
      const searchText = `${conv.title} ${conv.preview}`.toLowerCase();
      return fitnessKeywords.some(keyword => searchText.includes(keyword));
    });
  },

  extractWorkoutPlan(conversation: ParsedConversation): string | null {
    // Find assistant messages that look like workout plans
    const planKeywords = ['day 1', 'day 2', 'monday', 'tuesday', 'sets', 'reps', 'exercise'];

    for (const message of conversation.messages) {
      if (message.role !== 'assistant') continue;

      const content = message.content.toLowerCase();
      const matchCount = planKeywords.filter(kw => content.includes(kw)).length;

      if (matchCount >= 3) {
        return message.content;
      }
    }

    return null;
  },
};
