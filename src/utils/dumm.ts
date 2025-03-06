import {Option} from "../components/ui/applicant/profile/Skills.tsx";

export interface MessageItem {
    id: number;
    avatar: string; // Avatar URL or path
    name: string;
    message: string;
    time: string;
}

export const messages: MessageItem[] = [
    {
        id: 1,
        avatar: "https://via.placeholder.com/40", // Replace with actual avatar URL
        name: "A.S Abubakar",
        message: "Your job with us is more of...",
        time: "2 hours ago",
    },
    {
        id: 2,
        avatar: "https://via.placeholder.com/40", // Replace with actual avatar URL
        name: "Umar M Ahmad",
        message: "Your job with us is more of...",
        time: "2 hours ago",
    },
    {
        id: 3,
        avatar: "https://via.placeholder.com/40", // Replace with actual avatar URL
        name: "Jawad Umar",
        message: "Your job with us is more of...",
        time: "2 hours ago",
    },
    {
        id: 4,
        avatar: "https://via.placeholder.com/40", // Replace with actual avatar URL
        name: "David Rose",
        message: "Your job with us is more of...",
        time: "2 hours ago",
    },
    {
        id: 5,
        avatar: "https://via.placeholder.com/40", // Replace with actual avatar URL
        name: "Khadija Umar",
        message: "Your job with us is more of...",
        time: "2 days ago",
    },
];

export const skills: Option[] = [
    {
        label: "Java", value: "Java"
    },
    {
        label: "Python", value: "Python"
    },
    {
        label: "JavaScript", value: "JavaScript"
    },
    {
        label: "C++", value: "C++"
    },
    {
        label: "React", value: "React"
    },
    {
        label: "Node.js", value: "Node.js"
    },
    {
        label: "TypeScript", value: "TypeScript"
    },
    {
        label: "SQL", value: "SQL"
    },
    {
        label: "Docker", value: "Docker"
    },
    {
        label: "AWS", value: "AWS"
    }
];
