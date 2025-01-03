import { publicApiClient } from "../../api/axios";
import { APIResponse, User } from "../types";

const AuthService = () => ({
    login: async (email: string, password: string): Promise<User> => {
        const response = await publicApiClient.post<APIResponse<User>>("/auth/login", {
            email,
            password,
        });
        return response.data;
    },

    logout: async (): Promise<void> => {
        // Example: Perform server-side logout if necessary
        await publicApiClient.get<APIResponse<string>>("/api/logout");
    },
});

export default AuthService;
