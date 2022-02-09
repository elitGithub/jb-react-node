import axios from './axios';
import { tokenService } from "./tokenService";

const VacationService = {
    list: async () => {
        const token = tokenService.getToken();
        const response = await axios.get(`/api/vacations/vacation-list`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }, });
        return await response.data;
    },
    follow: async (id) => {
        const token = tokenService.getToken();
        const response = await axios.get(`/api/vacations/vacation-follow/${ id }`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` }, });
        return await response.data;
    }
};

export default VacationService;
