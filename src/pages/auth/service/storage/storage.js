

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

export const getUserId = () => {
    return JSON.parse(localStorage.getItem("user")).id;
};

export const isUserLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.userRole === "USER")
        return true;
    else
        return false;
};


const storage = {
    isUserLoggedIn,
    getUser,
    getUserId
};

export default storage;
