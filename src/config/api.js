export const HF_API_CONFIG = {
  API_URL: 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-6.7b-instruct',
  API_KEY: process.env.REACT_APP_HF_API_KEY,
  MAX_LENGTH: 1000
};

export const CLAUDE_API_CONFIG = {
  API_URL: 'http://localhost:3000/api/chat',
  MODEL: 'saiga2',
  MAX_TOKENS: 1000
};

export const formatClaudeRequest = (messages) => {
  return {
    model: CLAUDE_API_CONFIG.MODEL,
    max_tokens: CLAUDE_API_CONFIG.MAX_TOKENS,
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  };
}; 