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
  SELECTED_MODEL: 'dobby-selected-model',
  THEME: 'dobby-theme'
} as const;

// Theme types
export type Theme = 'light' | 'dark';

// Theme configuration
export const THEMES = {
  light: {
    name: 'Light',
    colors: {
      background: 'bg-white',
      backgroundSecondary: 'bg-gray-50',
      backgroundTertiary: 'bg-gray-100',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textTertiary: 'text-gray-500',
      border: 'border-gray-200',
      borderSecondary: 'border-gray-300',
      hover: 'hover:bg-gray-100',
      hoverSecondary: 'hover:bg-gray-200',
      input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      button: 'bg-gray-900 text-white hover:bg-gray-800',
      buttonSecondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-300',
      chatBubbleUser: 'bg-gray-900 text-white',
      chatBubbleAI: 'bg-gray-100 text-gray-900 border-gray-200',
      dropdown: 'bg-white border-gray-200 shadow-lg',
      dropdownItem: 'hover:bg-gray-100 text-gray-900',
      dropdownItemSelected: 'bg-gray-900 text-white',
      scrollbarTrack: 'bg-gray-100',
      scrollbarThumb: 'bg-gray-400',
      scrollbarThumbHover: 'bg-gray-500'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      background: 'bg-gray-800',
      backgroundSecondary: 'bg-gray-700',
      backgroundTertiary: 'bg-gray-600',
      text: 'text-gray-100',
      textSecondary: 'text-gray-300',
      textTertiary: 'text-gray-400',
      border: 'border-gray-700',
      borderSecondary: 'border-gray-600',
      hover: 'hover:bg-gray-800',
      hoverSecondary: 'hover:bg-gray-700',
      input: 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400',
      button: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      buttonSecondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600 border-gray-600',
      chatBubbleUser: 'bg-gray-100 text-gray-900',
      chatBubbleAI: 'bg-gray-800 text-gray-100 border-gray-700',
      dropdown: 'bg-gray-800 border-gray-700 shadow-xl',
      dropdownItem: 'hover:bg-gray-700 text-gray-100',
      dropdownItemSelected: 'bg-gray-100 text-gray-900',
      scrollbarTrack: 'bg-gray-800',
      scrollbarThumb: 'bg-gray-600',
      scrollbarThumbHover: 'bg-gray-500'
    }
  }
} as const; 