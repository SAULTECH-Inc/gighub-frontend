import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ModalState {
    modals: Record<string, boolean>;
    openModal: (modalId: string) => void;
    closeModal: (modalId: string) => void;
    toggleModal: (modalId: string) => void;
    isModalOpen: (modalId: string) => boolean;
}

const useModalStore = create<ModalState>()(
    devtools(
        (set, get) => ({
            modals: {},
            openModal: (modalId) =>
                set(
                    (state) => ({
                        modals: { ...state.modals, [modalId]: true }
                    }),
                    false,
                    'openModal' // Action name for devtools
                ),
            closeModal: (modalId) =>
                set(
                    (state) => ({
                        modals: { ...state.modals, [modalId]: false }
                    }),
                    false,
                    'closeModal' // Action name for devtools
                ),
            toggleModal: (modalId) =>
                set(
                    (state) => ({
                        modals: {
                            ...state.modals,
                            [modalId]: !state.modals[modalId]
                        }
                    }),
                    false,
                    'toggleModal' // Action name for devtools
                ),
            isModalOpen: (modalId) => !!get().modals[modalId]
        }),
        {
            name: 'ModalStore', // Name in devtools
            store: 'modalStore' // Optional store identifier
        }
    )
);

export default useModalStore;