import axios from './axios';
import { tokenService } from "./tokenService";

const FileService = {
    upload: async (file) => {
        console.log(file);
        const token = tokenService.getToken();
        const formData = new FormData();

        formData.append('file', file);
        const result = await axios.post('/api/fileUpload/', formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${ token }` },
        });

        return await result.data;
    }
}

export default FileService;
