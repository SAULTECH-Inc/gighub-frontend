import React, {useEffect, useState} from "react";
import TextEditor from "../../../common/TextEditor.tsx";
import {ApplicantData, CvResponseDto} from "../../../../utils/types";
import {useAuth} from "../../../../store/useAuth.ts";

const CompanyOverview: React.FC = ()=>{
    const {applicant, setProfileData} = useAuth();
    const [value, setValue] = useState<string>(
        applicant?.cv?.professionalSummary ? applicant?.cv?.professionalSummary: "");
    useEffect(() => {
        let currentCv = applicant?.cv;
        if(currentCv === undefined){
            const newCv = {
                professionalSummary: value,
            } as CvResponseDto;
            setProfileData({
                cv: newCv
            });
        }else{
            currentCv = {
                ...currentCv,
                professionalSummary: value,
            }
            setProfileData({
                ...applicant as ApplicantData,
                cv: currentCv,
            });
        }
    }, [value]);
    return (<section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
        <h5 className="font-lato text-[20px] mb-4">
            Short bio
        </h5>
        <div className="flex flex-col">
            <label className="text-[16px] text-gray-600 mb-5">About the company</label>

            {/* Textarea */}
            <TextEditor value={value} onChange={setValue}/>
        </div>
    </section>);
}

export default CompanyOverview;