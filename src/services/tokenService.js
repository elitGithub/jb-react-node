export const tokenService = {
    getToken: () => localStorage.getItem('token'),
    hasToken: !!localStorage.getItem('token'),

};
