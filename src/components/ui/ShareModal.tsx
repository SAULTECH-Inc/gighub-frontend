import React from 'react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose} // Close the modal when clicking outside of it
        >
            {/* Modal Content */}
            <div
                className="bg-white w-[314px] h-[279px] rounded-[10px] shadow-lg p-6 flex flex-col justify-center relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-[24px] text-gray-500 hover:text-gray-700 p-2"
                >
                    ✕
                </button>

                {/* Copy Link Section */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2 text-left">Copy link</label>
                    <div className="flex items-center border-[#E6E6E6] border-[1px] rounded-[10px] w-[262px] h-[43px] p-2">
                        <input
                            type="text"
                            value="https://example.com/share"
                            readOnly
                            className="flex-grow text-sm text-gray-800 outline-none border-0"
                        />
                        <button
                            className="ml-2 text-purple-600 hover:text-purple-700 font-medium"
                            onClick={() => navigator.clipboard.writeText('https://example.com/share')}
                        >
                            Copy
                        </button>
                    </div>
                </div>

                {/* Share Link Options */}
                <div>
                    <p className="text-sm text-gray-600 mb-2 text-left">Share Link</p>
                    <div className="flex justify-between">
                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/?text=https://example.com/share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center text-sm text-gray-600 hover:text-purple-600"
                        >
                            <img
                                src="https://img.icons8.com/color/48/whatsapp.png"
                                alt="WhatsApp"
                                className="w-8 h-8"
                            />
                            WhatsApp
                        </a>
                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/shareArticle?url=https://example.com/share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center text-sm text-gray-600 hover:text-purple-600"
                        >
                            <img
                                src="https://img.icons8.com/color/48/linkedin.png"
                                alt="LinkedIn"
                                className="w-8 h-8"
                            />
                            LinkedIn
                        </a>
                        {/* X.com */}
                        <a
                            href="https://x.com/share?url=https://example.com/share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center text-sm text-gray-600 hover:text-purple-600"
                        >
                            <img
                                src="https://img.icons8.com/ios-glyphs/48/000000/twitter.png"
                                alt="X.com"
                                className="w-8 h-8"
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
