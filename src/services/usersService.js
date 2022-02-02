import axios from './axios';

const UsersService = {
    register: async (user) => {
        const response = await axios.post(`/api/users/register`, user);
        return await response.data;
    },
}


export default UsersService;
