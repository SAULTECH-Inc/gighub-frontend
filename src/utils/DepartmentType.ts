interface Option {
    value: string;
    label: string;
  }

export const DepartmentType: Option[] = [
  { value: "Engineering", label: "Engineering" },
  { value: "Software_Development", label: "Software Development" },
  { value: "Data_Science", label: "Data Science" },
  { value: "Product_Management", label: "Product Management" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "Human_Resources", label: "Human Resources" },
  { value: "Finance", label: "Finance" },
  { value: "Accounting", label: "Accounting" },
  { value: "Customer_Support", label: "Customer Support" },
  { value: "Information_Technology", label: "Information Technology" },
  { value: "Design", label: "Design" },
  { value: "UX_UI", label: "UX/UI" },
  { value: "Operations", label: "Operations" },
  { value: "Supply_Chain", label: "Supply Chain" },
  { value: "Logistics", label: "Logistics" },
  { value: "Research_Development", label: "Research & Development" },
];

export const EmploymentType: Option[] = [
    { value: "Onsite", label: "Onsite" },
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
  ];

