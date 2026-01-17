import React, { useState } from "react";
import Modal from "../common/Modal.tsx";

interface ShareModalProps {
  modalId: string;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ modalId, url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const encodedUrl = encodeURIComponent(url);

  return (
    <Modal modalId={modalId}>
      <div className="relative flex h-[299px] w-[364px] flex-col justify-center rounded-[10px] bg-white p-6 shadow-lg">
        {/* Close Button */}
        <button
          onClick={() =>
            import("../../store/modalStateStores.ts").then(({ default: store }) =>
              store.getState().closeModal(modalId)
            )
          }
          className="absolute top-2 right-2 p-2 text-[24px] text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Copy Link Section */}
        <div className="mb-4">
          <label className="mb-2 block text-left text-sm text-gray-600">
            Copy link
          </label>
          <div className="flex items-center rounded-[10px] border border-[#E6E6E6] p-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-grow border-0 text-sm text-gray-800 outline-none"
            />
            <button
              onClick={handleCopy}
              className="ml-2 font-medium text-purple-600 hover:text-purple-700"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div>
          <p className="mb-2 text-left text-sm text-gray-600">Share Link</p>
          <div className="flex justify-between gap-3">
            <a
              href={`https://wa.me/?text=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600"
            >
              <img src="https://img.icons8.com/color/48/whatsapp.png" />
              WhatsApp
            </a>

            <a
              href={`https://www.linkedin.com/shareArticle?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600"
            >
              <img src="https://img.icons8.com/color/48/linkedin.png" />
              LinkedIn
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600"
            >
              <img src="https://img.icons8.com/ios-glyphs/48/000000/twitter.png" />
              X.com
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
