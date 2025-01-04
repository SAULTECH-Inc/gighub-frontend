import TextInput from "../components/common/TextInput.tsx";
import {useEffect, useState} from "react";
import TextArea from "../components/common/TextArea.tsx";
import DropDown from "../components/common/DropDown.tsx";
import DatePicker from "../components/common/DatePicker.tsx";
import Button from "../components/common/Button.tsx";
import ProgressBar from "../components/common/ProgressBar.tsx";

export const Home = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');

    const countryOptions = [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
        { label: 'United Kingdom', value: 'uk' },
    ];
    const [date, setDate] = useState('');

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 10;
                }
                return 0; // Reset to 0 after reaching 100 for demo
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <TextInput
                label="Your Name"
                name="name"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
            />
            <TextArea
                label="Description"
                name="description"
                value={description}
                placeholder="Enter a brief description"
                onChange={(e) => setDescription(e.target.value)}
            />
            <DropDown
                label="Country"
                name="country"
                value={selectedCountry}
                options={countryOptions}
                onChange={(e) => setSelectedCountry(e.target.value)}
            />

            <DatePicker
                label="Select Date"
                name="myDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <div className="flex space-x-2">
                <Button label="Primary" onClick={() => alert('Primary clicked')}/>
                <Button
                    label="Secondary"
                    variant="secondary"
                    onClick={() => alert('Secondary clicked')}
                />
                <Button
                    label="Danger"
                    variant="danger"
                    onClick={() => alert('Danger clicked')}
                />
            </div>

            <div className="w-1/2">
                <ProgressBar value={progress}/>
                <p>{progress}%</p>
            </div>


        </>
    );
};
