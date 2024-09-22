import axiosInstance from '../../../../environment/axiosInstance';

export const signup = async (signupDTO) => {
    try {
        const response = await axiosInstance.post('api/auth/signup', signupDTO);
        return response;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};

export const login = async (loginDTO) => {
    try {
        const response = await axiosInstance.post('api/auth/login', loginDTO);
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

const auth = {
    signup,
    login
};

export default auth;
