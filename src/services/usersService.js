import axios from './axios';
import LoginService from "./loginService";

const UsersService = {
    register: async (user) => {
        const response = await axios.post(`/api/users/register`, user);
        return await response.data;
    },
    login: async user => await LoginService.login(user),
    checkLogin: async () => await LoginService.checkLogin(),
}


export default UsersService;
