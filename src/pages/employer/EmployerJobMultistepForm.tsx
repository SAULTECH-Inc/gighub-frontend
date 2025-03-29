import React from "react";
import CreateJobStepOne from "../../components/ui/employer/createjob/CreateJobStepOne";
import CreateJobStepTwo from "../../components/ui/employer/createjob/CreateJobStepTwo";
import CreateJobStepThree from "../../components/ui/employer/createjob/CreateJobStepThree";
import CreateJobStepFour from "../../components/ui/employer/createjob/CreateJobStepFour";
import {useJobFormStore} from "../../store/useJobFormStore";
import {Gighub} from "../../assets/icons";
import cancel from "../../assets/icons/cancelMedium.svg";
import useModalStore from "../../store/modalStateStores";

interface EmployerJobMultistepFormProps {
    modalId: string
}

const EmployerJobMultistepForm: React.FC<EmployerJobMultistepFormProps> = ({modalId}) => {
    const {step} = useJobFormStore();
    const { modals, closeModal} = useModalStore();
    const isOpen = modals[modalId];

    const handleClose = () => {
        closeModal(modalId);
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-2 overflow-y-auto z-50">
            <div className="w-full max-w-[900px] bg-[#F7F7F7] rounded-lg shadow-xl flex flex-col items-center">
                <div className="w-[92%] max-w-[900px] py-2 flex flex-col gap-4">
                    <div className="flex justify-between">
                        <h1 className="text-[#000000] font-bold sm:text-2xl">Add new job</h1>
                        <img src={cancel} alt="cancel" onClick={handleClose} className="w-3 sm:w-4"/>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <img src={Gighub} alt="gighub logo"/>
                            <p className="text-[#FA4E09] fw-900">GigHub</p>
                        </div>
                        <div className="flex flex-wrap sm:items-center gap-4 font-bold">
                            <div
                                className="flex self-center relative rounded-[10px] overflow-hidden h-[10px] w-[100px] sm:w-[247px]">
                                <div
                                    className="absolute left-0 top-0 bg-[#6438C2] h-full"
                                    style={{width: `${(step / 4) * 100}%`}}
                                ></div>
                                <div
                                    className="absolute top-0 right-0 bg-white h-full"
                                    style={{
                                        width: `${(1 - step / 4) * 100}%`,
                                        left: `${(step / 4) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <span className="">{step} / 4</span>
                        </div>
                    </div>
                </div>
                <div className="w-full px-4 rounded-[10px] flex flex-col items-center justify-center">
                    {step === 1 && <CreateJobStepOne/>}
                    {step === 2 && <CreateJobStepTwo/>}
                    {step === 3 && <CreateJobStepThree/>}
                    {step === 4 && <CreateJobStepFour/>}
                </div>
            </div>
        </div>
    );
};
export default EmployerJobMultistepForm;

