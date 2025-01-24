import React, { useState } from 'react';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleSelection = (option: string) => {
        setSelectedOptions(prevState =>
            prevState.includes(option)
                ? prevState.filter(item => item !== option)
                : [...prevState, option]
        );
    };

    const handleApplyNow = () => {
        console.log(`Applied with: ${selectedOptions.join(', ')}`);
        onClose(); // Close the modal after applying
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 shadow-lg" style={{ width: '567.5px' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Select Method of Application</h2>
                    <button onClick={onClose} className="text-gray-500 text-2xl">×</button>
                </div>
                <p className="mb-6 text-gray-600">We will automatically help you figure out the raised</p>

                {/* Recruiter Requirement buttons */}
                <div className="flex space-x-3 mb-6">
                    {['CV', 'Portfolio', 'Recent worksample'].map((label) => (
                        <button
                            key={label}
                            className={`py-2 px-6 rounded-full text-sm border-2 ${
                                selectedOptions.includes(label)
                                    ? 'bg-purple-600 text-white border-purple-600'
                                    : 'bg-purple-100 text-purple-600 border-purple-200'
                            }`}
                            onClick={() => handleSelection(label)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Text above the cards */}
                <p className="text-sm text-gray-500 mb-4">Please select your method of application and we will automatically send your application to the recruiter.</p>

                {/* Grid layout for the application method cards */}
                <div className="grid grid-cols-2 gap-4">
                    {['Applied with Profile', 'Apply with Video', 'Apply with CV', 'Apply with work sample'].map((label) => (
                        <div
                            key={label}
                            className={`relative flex flex-col items-center p-4 border-3 rounded-[16px] cursor-pointer ${
                                selectedOptions.includes(label) ? 'bg-purple-100' : 'bg-white'
                            }`}
                            onClick={() => handleSelection(label)}
                            style={{ width: '214px', height: '154px', borderWidth: '3px' }}
                        >
                            <div className="w-16 h-16 bg-gray-300 border-[#6438C2] rounded-lg mb-3"></div>
                            <span className="font-medium text-center">{label}</span>
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(label)}
                                readOnly
                                className={`absolute top-2 right-2 w-[27px] h-[27px] rounded-full 
                  ${selectedOptions.includes(label) ? 'bg-[#6438C2] border-none' : 'bg-white border-[#ccc]'}
                  hover:bg-[#6438C2] focus:bg-[#6438C2] active:bg-[#6438C2] appearance-none 
                  checked:checked:bg-[#6438C2] checked:border-none`}
                            />
                        </div>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex justify-between mt-6">
                    <button onClick={onClose} className="py-2 px-6 bg-gray-300 rounded-lg text-sm text-gray-700">
                        Go to recruiter profile
                    </button>
                    <button onClick={handleApplyNow} className="py-2 px-6 bg-purple-600 text-white rounded-lg">
                        Apply now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationModal;
