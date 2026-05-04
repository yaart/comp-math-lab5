import axios from 'axios';
import { InterpolationRequest, InterpolationResponse } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const interpolationApi = {

    calculate: async (data: InterpolationRequest): Promise<InterpolationResponse[]> => {
        try {
            const response = await api.post<InterpolationResponse[]>('/interpolation/calculate', data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при расчете интерполяции:', error);
            throw error;
        }
    },
};

export default api;