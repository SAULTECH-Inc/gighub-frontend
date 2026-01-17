import React, { memo, PropsWithChildren, useEffect } from "react";
import useModalStore from "../../store/modalStateStores.ts";

interface ModalProps {
  modalId: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  backdropClassName?: string;
  containerClassName?: string;
  zIndex?: number;
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
                                                          modalId,
                                                          children,
                                                          closeOnBackdrop = true,
                                                          closeOnEsc = true,
                                                          backdropClassName = "bg-black/30",
                                                          containerClassName = "flex items-center justify-center",
                                                          zIndex = 50,
                                                        }) => {
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal(modalId);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeOnEsc, modalId, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${containerClassName} ${backdropClassName}`}
      style={{ zIndex }}
      onClick={closeOnBackdrop ? () => closeModal(modalId) : undefined}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default memo(Modal);
