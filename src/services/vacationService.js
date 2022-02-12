import axios from './axios';
import { tokenService } from "./tokenService";

const VacationService = {
    create: async (vacation) => {
        const token = tokenService.getToken();
        const response = await axios.post('/api/vacations/vacation', vacation, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${ token }` },
        });
        return await response.data;
    },
    deleteVacation: async (vacation) => {
        const token = tokenService.getToken();
        const response = await axios.delete(`/api/vacations/vacation/${vacation}`, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${ token }` },
        });
        return await response.data;
    },
    update: async (vacation) => {
        const token = tokenService.getToken();
        const response = await axios.put(`/api/vacations/vacation/${vacation.id}`, vacation, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${ token }` },
        });
        return await response.data;
    },
    list: async () => {
        const token = tokenService.getToken();
        const response = await axios.get(`/api/vacations/vacation-list`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${ token }` }, });
        return await response.data;
    },
    follow: async (id) => {
        const token = tokenService.getToken();
        const response = await axios.get(`/api/vacations/vacation-follow/${ id }`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${ token }` }, });
        return await response.data;
    },
    unfollow: async (id) => {
        const token = tokenService.getToken();
        const response = await axios.delete(`/api/vacations/vacation-follow/${ id }`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${ token }` }, });
        return await response.data;
    },
    one: async (id) => {
        const token = tokenService.getToken();
        const response = await axios.get(`/api/vacations/vacation/${ id }`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${ token }` }, });
        return await response.data;
    }
};

export default VacationService;
