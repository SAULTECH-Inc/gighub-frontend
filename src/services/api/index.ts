import {APIResponse, ApplicantData} from "../../utils/types";
import {privateApiClient} from "../../api/axios.ts";
import {API_BASE_URL} from "../../utils/constants.ts";

export async function fetchPrivateMessages(user: string, otherUser: string) {
    try {
        const response = await fetch(
            `http://localhost:3003/messages/private?user=${encodeURIComponent(user)}&otherUser=${encodeURIComponent(otherUser)}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching private messages:', error);
        return [];
    }
}

export async function fetchGroupMessages(groupId: string) {
    try {
        const response = await fetch(`http://localhost:3003/messages/group?groupId=${encodeURIComponent(groupId)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch group messages: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching group messages:', error);
        return [];
    }
}


export const fetchUsers = async (
    page: number,
    limit: number,
): Promise<APIResponse<ApplicantData[]>> => {
    const response = await privateApiClient.get<APIResponse<ApplicantData[]>>(
        `${API_BASE_URL}/users/connections/all?page=${page}&limit=${limit}`
    );
    return response?.data;
};

export const fetchConnectionRequests = async (
    page: number,
    limit: number,
): Promise<APIResponse<ApplicantData[]>> => {
    const response = await privateApiClient.get<APIResponse<ApplicantData[]>>(
        `${API_BASE_URL}/users/connections/requests?page=${page}&limit=${limit}`
    );
    return response?.data;
}

export const searchUsers = async (
    page: number,
    limit: number,
    filters: {
        name?: string;
        profession?: string;
        location?: string;
    }
): Promise<APIResponse<ApplicantData[]>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.name && { name: filters.name }),
        ...(filters.profession && { profession: filters.profession }),
        ...(filters.location && { location: filters.location }),
    });

    const response = await privateApiClient.get<APIResponse<ApplicantData[]>>(`${API_BASE_URL}/users/connections?${params}`);
    return response.data;
};

