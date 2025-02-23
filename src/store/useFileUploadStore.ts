import {FileUploadRequest, FileUploadResponse} from "../utils/types";
import {create} from "zustand";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import axios from "axios";
import {VITE_API_FILE_SERVICE} from "../utils/constants.ts";
import {toast} from "react-toastify";

interface InitialState {
    profilePictureUploadRequest: FileUploadRequest | null;
    profilePictureUploadResponse: FileUploadResponse | null;
    uploadProfilePicture: (request: FileUploadRequest, path: string) => Promise<boolean>;
    resetProfilePictureUploadRequest: () => void;
    resetProfilePictureUploadResponse: () => void;
    resetFileUploadStore: () => void;
    setProfilePictureUploadRequest: (request: FileUploadRequest) => void;
}

export const useFileUploadStore = create<InitialState>()(persist(immer<InitialState>((set, ) => ({
    profilePictureUploadRequest: null,
    profilePictureUploadResponse: null,
    uploadProfilePicture: async (request, path) => {
        const formData = new FormData();

            formData.append("file", request.file);
            formData.append("userId", request.userId.toString());
            formData.append("userType", request.userType);
            formData.append("whatIsTheItem", request.whatIsTheItem);
            formData.append("action", request.action);

        try {
            const response = await axios.post(`${VITE_API_FILE_SERVICE}/${path}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("File uploaded successfully");
            set((state) => {
                state.profilePictureUploadResponse = response.data.data;
            });
            return true;
        } catch (error) {
            console.error("File upload failed:", error);
            toast.error("Failed to upload file ::: "+JSON.stringify(error));
            return false;
        }
    },
    resetProfilePictureUploadRequest: () => set({profilePictureUploadRequest: null}),
    resetProfilePictureUploadResponse: () => set({profilePictureUploadResponse: null}),
    resetFileUploadStore: () => set({
        profilePictureUploadRequest: null,
        profilePictureUploadResponse: null,
    }),
    setProfilePictureUploadRequest: (request) => set((state) => {
        state.profilePictureUploadRequest = request;
    }),
})), {
    name: "fileUploadStore",
    partialize: (state) => ({
        profilePictureUploadRequest: state.profilePictureUploadRequest,
        profilePictureUploadResponse: state.profilePictureUploadResponse,
        uploadProfilePicture: state.uploadProfilePicture,
        resetProfilePictureUploadRequest: state.resetProfilePictureUploadRequest,
        resetProfilePictureUploadResponse: state.resetProfilePictureUploadResponse,
        resetFileUploadStore: state.resetFileUploadStore,
        setProfilePictureUploadRequest: state.setProfilePictureUploadRequest,
    })
}));