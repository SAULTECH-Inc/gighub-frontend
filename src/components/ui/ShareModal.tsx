import React, { useState } from "react";
import useModalStore from "../../store/modalStateStores.ts";

interface ShareModalProps {
  modalId: string;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ modalId, url }) => {
  const { isModalOpen, closeModal } = useModalStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isModalOpen(modalId)) return null;

  const encodedUrl = encodeURIComponent(url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20"
      onClick={() => closeModal(modalId)}
    >
      <div
        className="relative flex h-[279px] w-[314px] flex-col justify-center rounded-[10px] bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => closeModal(modalId)}
          className="absolute right-2 top-2 p-2 text-[24px] text-gray-500 hover:text-gray-700"
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
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600"
            >
              <img
                src="https://img.icons8.com/color/48/whatsapp.png"
                alt="WhatsApp"
                className="h-8 w-8"
              />
              WhatsApp
            </a>
            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/shareArticle?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600"
            >
              <img
                src="https://img.icons8.com/color/48/linkedin.png"
                alt="LinkedIn"
                className="h-8 w-8"
              />
              LinkedIn
            </a>
            {/* X (Twitter) */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600"
            >
              <img
                src="https://img.icons8.com/ios-glyphs/48/000000/twitter.png"
                alt="X.com"
                className="h-8 w-8"
              />
              X.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
