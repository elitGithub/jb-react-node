import axios from 'axios';
import configService from './configService';
export default axios.create({
    baseURL: configService.apiUrl
});