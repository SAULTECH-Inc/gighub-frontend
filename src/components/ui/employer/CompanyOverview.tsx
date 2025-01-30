import React from "react";
import TextEditor from "../../common/TextEditor.tsx";

const CompanyOverview: React.FC = ()=>{
    return (<section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
        <h3 className="font-lato text-[20px] mb-4">
            Company Overview
        </h3>
        <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-5">About the company</label>

            {/* Textarea */}
            <TextEditor/>
        </div>
    </section>);
}

export default CompanyOverview;