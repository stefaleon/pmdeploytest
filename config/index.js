export const API_URL =
  // 'https://project-manager-backend-ls.herokuapp.com'
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export const NEXT_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

export const PAGINATION_LIMIT = 10;
