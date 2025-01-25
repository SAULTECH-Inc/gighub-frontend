import { create } from 'zustand';

interface ModalState {
    modals: Record<string, boolean>; // Object to track the state of multiple modals
    openModal: (modalId: string) => void;
    closeModal: (modalId: string) => void;
    toggleModal: (modalId: string) => void;
    isModalOpen: (modalId: string) => boolean; // Helper to check if a modal is open
}

const useModalStore = create<ModalState>((set, get) => ({
    modals: {},

    openModal: (modalId: string) =>
        set((state) => ({
            modals: { ...state.modals, [modalId]: true },
        })),

    closeModal: (modalId: string) =>
        set((state) => ({
            modals: { ...state.modals, [modalId]: false },
        })),

    toggleModal: (modalId: string) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [modalId]: !state.modals[modalId],
            },
        })),

    isModalOpen: (modalId: string) => !!get().modals[modalId], // Use `get` to avoid circular reference
}));

export default useModalStore;
