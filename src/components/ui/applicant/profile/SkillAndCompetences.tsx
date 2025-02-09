import React, {useState} from "react";
import Certifications from "./Certifications.tsx";
import Skills from "./Skills.tsx";
import {skills} from "../../../../utils/dumm.ts";


const SkillsAndCompetences: React.FC = () => {
    const [certifications, setCertifications] = useState<string[]>([]);



    const handleCertificationRemove = (certification: string) => {
        setCertifications((prevCertifications) =>
            prevCertifications.filter((item) => item !== certification)
        );
    };



    const addCertification = (certification: string) => {
        if (!certifications.includes(certification)) {
            setCertifications((prevCertifications) => [...prevCertifications, certification]);
        }
    };

    return (
        <section className="w-full pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-3">
            <div className="w-full space-y-6">
                <h3 className="text-xl">Skills and Competences</h3>
                <div
                    className="w-full flex flex-col md:flex-row md:justify-evenly md:items-start md:gap-x-8 space-y-4 md:space-y-0">
                    {/* Skills Section */}
                    <Skills options={skills}/>

                    {/* Certification Section */}
                    <Certifications handleCertificationRemove={handleCertificationRemove}
                                    certifications={certifications} addCertification={addCertification}/>
                </div>
            </div>
        </section>
    );
};

export default SkillsAndCompetences;
