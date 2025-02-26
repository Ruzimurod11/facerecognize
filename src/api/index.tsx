export const api = (url: string, input?: RequestInit) => {
   return fetch(`http://217.114.4.62:30300/api/${url}`, input);
};
