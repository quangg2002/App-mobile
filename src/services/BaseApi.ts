import axios, { AxiosError, AxiosHeaders } from "axios";
import { BASE_URL } from "../config/config";
import { store } from "../redux/store/store";

const BASE_API = axios.create({
    baseURL: `${BASE_URL}`,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
});

BASE_API.interceptors.request.use(
    async (config) => {
        const token = await store.getState().authReducer.access_token;
        if (config.headers && token.trim())
            (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
        return config;
    },
    (error) => {
        console.log('Request error: ', error)
        return Promise.reject(error);
    },
);

export {
    BASE_API,
};