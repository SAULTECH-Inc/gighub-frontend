import {AddEducationRequestDto, EducationResponseDto} from "../utils/types";
import { create } from "zustand";
import {privateApiClient} from "../api/axios.ts";

interface EducationData {
    submitSuccess: boolean;
    error: string | null;
    education: EducationResponseDto;
    setEducation: (education: EducationResponseDto) => void;
    submitEducation: (data: EducationResponseDto, applicantId: number, cvId:  number) => Promise<boolean>;
    deleteEducation: (educationId: number, applicantId: number, cvId: number) => Promise<boolean>;
    resetEducation: () => void;
}

const initialEducationState: EducationResponseDto = {
    institution: "",
    degree: "",
    startDate: new Date(),
    endDate: new Date(),
    grade: "",
    country: "",
    city: "",
    fieldOfStudy: "",
    description: "",
};

const useEducationFormStore = create<EducationData>((set) => ({
    education: initialEducationState,
    submitSuccess: false,
    error: null,
    setEducation: (education) => set({ education }),
    submitEducation: async (data: EducationResponseDto, applicantId: number, cvId:  number) => {
        try {
            const request: AddEducationRequestDto = {
                education: data,
                applicantId: Number(applicantId),
                cvId: Number(cvId),
            }
            const response = await privateApiClient.post("/cv/add-education", request);
            console.log("Education form submitted successfully:", response.data);
            set({ education:  response.data.data, submitSuccess: true }); // Reset form after submission
            return true;
        } catch (error: any) {
            console.error("Error submitting education form:", error);
            set({ error: error.response?.data?.message || "Unknown error occurred" });
        }
        return false;
    },
    deleteEducation: async (educationId: number, applicantId: number, cvId: number) => {
        try {
            await privateApiClient.post(`/cv/delete-education`, {
                applicantId: Number(applicantId),
                cvId: Number(cvId),
                educationId: Number(educationId),
            });
            console.log("Education deleted successfully");
            return true;
        } catch (error: any) {
            console.error("Error deleting education:", error);
            set({ error: error.response?.data?.message || "Unknown error occurred" });
        }
        return false;
    },

    resetEducation: () => set({ education: initialEducationState }),
}));

export default useEducationFormStore;
