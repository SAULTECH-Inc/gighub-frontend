import React, { useState } from "react";
import Certifications from "./Certifications.tsx";
import Skills from "./Skills.tsx";
import { skills as skillsOptions } from "../../../../utils/dumm.ts";
import {useAuth} from "../../../../store/useAuth.ts";
import {toast} from "react-toastify";
import {useAddSkill, useDeleteSkill} from "../../../../hooks/useSkills.tsx";
import {ApplicantData, CvResponseDto, SkillsResponseDto} from "../../../../utils/types";
import {useAddCertification, useDeleteCertification} from "../../../../hooks/useCertification.tsx";

export interface CertParams{
    id?: number;
    certName: string;
    institution: string;
    year: string;
}
const SkillsAndCompetences: React.FC = () => {
    const {applicant, setProfileData} = useAuth();
    const arr = (applicant?.cv?.skills?.map(s => s.skill) || []) as string[];
    const [skills, setSkills] = useState<string[]>( arr);
    const [certifications, setCertifications] = useState<CertParams[]>(applicant?.cv?.certifications
        ?.map(c => ({certName: c.certification, institution: c.institution, year: c.dateObtained} as CertParams)) || [] as CertParams[]);
    const addSkillMutation = useAddSkill();
    const deleteSkillMutation = useDeleteSkill();
    const addCertificationMutation = useAddCertification();
    const deleteCertificationMutation = useDeleteCertification();

    // Handle skill addition
    const addSkill = async (skill: string) => {
        if (!skills.includes(skill)) {
            const newSkill: SkillsResponseDto = {
                skill: skill,
            }
            await addSkillMutation.mutateAsync({ skill: newSkill, applicantId: Number(applicant?.id) || 0, cvId: Number(applicant?.cv?.id) || 0 },{
                onError: (error) => toast.error("Error adding skill ::: " + error.message),
                onSuccess: (data) => {
                    const updatedSkills = [...applicant?.cv?.skills || []];
                    updatedSkills.push(data?.data);
                    setProfileData({
                        ...applicant,
                        cv: {
                            ...applicant?.cv,
                            skills: updatedSkills,
                        } as CvResponseDto,
                    } as ApplicantData);
                    setSkills((prevSkills) => [...prevSkills, skill]);
                },
            });

        }
    };

    // Handle skill removal
    const removeSkill = async (skill: string) => {
        setSkills((prevSkills) => prevSkills.filter((item) => item!== skill));
     await deleteSkillMutation.mutateAsync({ skill: skill, applicantId: Number(applicant?.id) || 0, cvId: Number(applicant?.cv?.id) || 0 }, {
    onError: (error) => toast.error("Error deleting skill ::: " + error.message),
    onSuccess: () => {
        const updatedSkills = [...applicant?.cv?.skills || []];
        updatedSkills.splice(updatedSkills.findIndex((s) => s.skill === skill), 1);
        setProfileData({
            ...applicant,
            cv: {
               ...applicant?.cv,
                skills: updatedSkills,
            } as CvResponseDto,
        } as ApplicantData);
    },
});
    };

    // Handle certification addition
    const addCertification = async (certification: CertParams) => {
        if (!certifications.includes(certification)) {
            setCertifications((prevCertifications) => [...prevCertifications, certification]);
            await addCertificationMutation.mutateAsync({
                certification: {
                    certification: certification.certName,
                    institution: certification.institution,
                    dateObtained: certification.year,
                },
                applicantId: Number(applicant?.id) || 0,
                cvId: Number(applicant?.cv?.id) || 0
            }, {
                onError: (error) => toast.error("Error adding certification ::: " + error.message),
                onSuccess: (data) => {
                    const updatedCertifications = [...applicant?.cv?.certifications || []];
                    updatedCertifications.push(data?.data);
                    setProfileData({
                        ...applicant,
                        cv: {
                            ...applicant?.cv,
                            certifications: updatedCertifications,
                        } as CvResponseDto,
                    } as ApplicantData);
                },
            });

        }
    };

    // Handle certification removal
    const handleCertificationRemove = async (certification: CertParams) => {
        setCertifications((prevCertifications) =>
            prevCertifications.filter((item) => item !== certification)
        );
        await deleteCertificationMutation.mutateAsync({
            certificationId: certification.id || 0,
            applicantId: applicant?.id || 0,
            cvId: applicant?.cv?.id || 0,
        },{
            onError: (error) => toast.error("Error deleting certification ::: " + error.message),
            onSuccess: () => {
                const updatedCertifications = [...applicant?.cv?.certifications || []];
                updatedCertifications.splice(updatedCertifications.findIndex((c) => c === certification), 1);
                setProfileData({
                    ...applicant,
                    cv: {
                        ...applicant?.cv,
                        certifications: updatedCertifications,
                    } as CvResponseDto,
                } as ApplicantData);
            },
        })
    };


    return (
        <section className="w-full pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-3">
            <div className="w-full space-y-6">
                <h3 className="text-xl">Skills and Competences</h3>
                <div className="w-full flex flex-col md:flex-row md:justify-evenly md:items-start md:gap-x-8 space-y-4 md:space-y-0">
                    {/* Skills Section */}
                    <Skills
                        options={skillsOptions}
                        skills={skills}
                        addSkill={addSkill}
                        removeSkill={removeSkill}
                    />

                    {/* Certification Section */}
                    <Certifications
                        handleCertificationRemove={handleCertificationRemove}
                        certifications={certifications}
                        addCertification={addCertification}
                    />
                </div>
            </div>
        </section>
    );
};

export default SkillsAndCompetences;
