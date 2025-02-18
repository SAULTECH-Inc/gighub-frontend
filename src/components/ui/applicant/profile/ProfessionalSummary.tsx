import React from "react";
import {useAuth} from "../../../../store/useAuth.ts";
import {ApplicantData, CvResponseDto} from "../../../../utils/types";

const ProfessionalSummary: React.FC = () => {
    const {applicant, setProfileData} = useAuth();
// In ProfessionalSummary.tsx
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let currentCv = applicant?.cv;
        if(currentCv === undefined){
            const newCv = {
                professionalTitle: value,
            } as CvResponseDto;
            setProfileData({
                cv: newCv
            });
        }else{
            currentCv = {
                ...currentCv,
                [name]: value,
            }
            setProfileData({
                ...applicant as ApplicantData,
                cv: currentCv,
            });
        }
    };



    return (
        <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-2">
            <h3 className="font-lato text-[20px] mb-4">
                Professional Summary
            </h3>
            <div className="w-full flex flex-col">
                <label
                    htmlFor="professionalTitle"
                    className="text-sm text-gray-600 mb-1"
                >
                    Professional Title
                </label>
                <input
                    type="text"
                    name="professionalTitle"
                    value={applicant?.cv?.professionalTitle || ""}
                    onChange={handleChange}
                    className="rounded-[10px] h-12 bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </section>
    );
};

export default ProfessionalSummary;
