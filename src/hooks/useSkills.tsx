import {APIResponse, SkillsResponseDto} from "../utils/types";
import {privateApiClient} from "../api/axios.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface AddSkillRequest{
    applicantId: number;
    cvId: number;
    skill: SkillsResponseDto;
}

interface DeleteSkillRequest {
    applicantId: number;
    cvId: number;
    skill: string;
}


// Add Skill
const addSkill = async (skill: SkillsResponseDto, applicantId: number, cvId: number): Promise<APIResponse<SkillsResponseDto>> => {
    const response = await privateApiClient.post("/cv/add-skill", {
        skill,
        applicantId,
        cvId,
    });
    return response.data;
};

// Delete Skill
const deleteSkill = async (applicantId: number, cvId: number, skill: string): Promise<APIResponse<void>> => {
    const response = await privateApiClient.post(`/cv/delete-skill`, {
        applicantId,
        cvId,
        skill,
    });
    return response.data;
};

// Custom hooks
export const useAddSkill = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ skill, applicantId, cvId }: AddSkillRequest) => addSkill(skill, applicantId, cvId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
        },
    });
};

export const useDeleteSkill = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ applicantId, cvId, skill }: DeleteSkillRequest) => deleteSkill(applicantId, cvId, skill),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
        },
    });
};
