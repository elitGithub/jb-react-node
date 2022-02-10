import axios from './axios';
import { tokenService } from "./tokenService";

const FileService = {
    upload: async (file) => {
        const token = tokenService.getToken();
        const formData = new FormData();

        formData.append('file', file);
        const result = await axios.post('/api/fileUpload/', formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${ token }` },
        });

        return await result.data;
    },
    validate: (file) => {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/bmp',
            'image/jfif',
            'image/tiff',
        ];
        console.log(file.type);
        console.log(allowedMimeTypes.indexOf(file.type));
        return allowedMimeTypes.indexOf(file.type) >= 0;
    }
}

export default FileService;
