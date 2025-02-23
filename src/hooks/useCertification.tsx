import {APIResponse, CertificationResponseDto} from "../utils/types";
import {privateApiClient} from "../api/axios.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface AddCertificationRequest{
    applicantId: number;
    cvId: number;
    certification: CertificationResponseDto;
}

interface DeleteCertificationRequest {
    applicantId: number;
    cvId: number;
    certificationId: number;
}


// Add Certification
const addCertification = async (certification: CertificationResponseDto, applicantId: number, cvId: number): Promise<APIResponse<CertificationResponseDto>> => {
    const response = await privateApiClient.post("/cv/add-certification", {
        certification,
        applicantId,
        cvId,
    });
    return response.data;
};

// Delete Certification
const deleteCertification = async (applicantId: number, cvId: number, certificationId: number): Promise<APIResponse<void>> => {
    const response = await privateApiClient.post(`/cv/delete-certification/${certificationId}`, {
        applicantId,
        cvId,
        certificationId,
    });
    return response.data;
};

// Custom hooks
export const useAddCertification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ certification, applicantId, cvId }: AddCertificationRequest) => addCertification(certification, applicantId, cvId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Certifications"] });
        },
    });
};

export const useDeleteCertification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ applicantId, cvId, certificationId }: DeleteCertificationRequest) => deleteCertification(applicantId, cvId, certificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Certifications"] });
        },
    });
};
