import React from "react";

interface ButtonProps {
  className?: string; // Optional Tailwind class string
  onClick?: () => void; // Optional click handler
  children: React.ReactNode; // Content inside the button
}

const Button: React.FC<ButtonProps> = ({ className, children, onClick }) => {
  return (
    <button
      className={`rounded-xl bg-tertiary font-bold text-white ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
