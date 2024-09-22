import axiosInstance from '../../../environment/axiosInstance';
import { getToken } from '../../auth/service/storage/storage';


export const getChatboxesByUser = async (userId) => {
    try {
        const response = await axiosInstance.get(`api/chatboxes/${userId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error while getting analytics:', error);
        throw error;
    }
};



export const getAllMessagesOfChatBoxApi = async (chatboxId) => {
    try {
        const response = await axiosInstance.get(`api/chatboxes/message/${chatboxId}`, {
        });
        return response;
    } catch (error) {
        console.error('Error while getting analytics:', error);
        throw error;
    }
};

export const sendMessage = async (data) => {
    try {
        const response = await axiosInstance.post(`api/chatboxes/message`, data, {
        });
        return response;
    } catch (error) {
        console.error('Error while getting analytics:', error);
        throw error;
    }
};

export const addUserInChatBox = async (chatBoxId, userId) => {
    try {
        const response = await axiosInstance.get(`api/chatboxes/add/${userId}/${chatBoxId}`);
        return response;
    } catch (error) {
        console.error('Error while getting analytics:', error);
        throw error;
    }
};

export const updateChatBoxName = async (chatBoxId, name) => {
    try {
        const response = await axiosInstance.get(`api/chatboxes/update/${chatBoxId}/${name}`);
        return response;
    } catch (error) {
        console.error('Error while getting analytics:', error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await axiosInstance.get(`api/chatboxes/users`, {
        });
        return response;
    } catch (error) {
        console.error('Error while getting orders:', error);
        throw error;
    }
};



export const createChatBoxApi = async (data) => {
    try {
        const response = await axiosInstance.post(`api/chatboxes`, data , {
        });
        return response;
    } catch (error) {
        console.error('Error while getting analytics:', error);
        throw error;
    }
};

const admin = {

    getChatboxesByUser,
    getAllMessagesOfChatBoxApi,
    addUserInChatBox,
    getUsers,
    createChatBoxApi,
    sendMessage,
    updateChatBoxName
};

export default admin;
