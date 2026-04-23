export const setToken = (token) => {
  localStorage.setItem('hf_access_token', token);
};

export const getToken = () => {
  return localStorage.getItem('hf_access_token');
};

export const removeToken = () => {
  localStorage.removeItem('hf_access_token');
};
