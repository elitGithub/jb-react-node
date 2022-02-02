import axios from './axios';
const LoginService = {
    login: async (user) => {
        const response = await axios.post(
            `/api/users/login`,
            {username: user.userName, password: user.password},
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
        return await response.data;
    },

    checkLogin: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const res = await axios.get(
                `/api/users/login`,
                {
                    headers: { 'Content-Type': 'application/json', "Authorization" : `Bearer ${token}` },
                    withCredentials: true,
                });

            const response = await res.data;
            if (response.hasOwnProperty('success') && response.success === true) {
                localStorage.setItem('token', response.data.token);
                return response.data;
            }
        }
    }
};

export default LoginService;
