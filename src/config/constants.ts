export const API_URL = (import.meta as any).env?.VITE_API_URL
export const X_URL = 'https://x.com/monleru';
export const TELEGRAM_URL = 'https://t.me/askDobbybot';
export const PRIVY_APP_ID = (import.meta as any).env?.VITE_PRIVY_APP_ID || 'cmf5b6yvy004wk00cmj07a826';

export const AI_MODELS = {
  'dobby-70b': {
    endpoint: 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new',
    name: 'Dobby 70B',
    description: 'Full 70B parameter model for high-quality responses and complex reasoning'
  },
  'dobby-mini': {
    endpoint: 'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b',
    name: 'Dobby Mini',
    description: 'Lightweight 1.8B parameter model for fast responses'
  },  'dobby-ddg': {
    endpoint: 'mcp/dobby-unhinged-llama-3-3-70b-new',
    name: 'Dobby DDG',
    description: 'Full 70B parameter model for high-quality responses and DDG mcp integration'
  }
} as const;

export type AIModelKey = keyof typeof AI_MODELS;

// localStorage keys
export const LOCALSTORAGE_KEYS = {
  SELECTED_MODEL: 'dobby-selected-model'
} as const; 