import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function useApi<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = async (
        method: "GET" | "POST" | "PUT" | "DELETE",
        url: string,
        body?: any
    ) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance({
                method,
                url,
                data: body,
            });

            setData(response.data);

            return response.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.response?.data?.detail ||
                err.message ||
                "An error occurred";

            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    return {
        data,
        loading,
        error,
        request,
    };
}

export default useApi;