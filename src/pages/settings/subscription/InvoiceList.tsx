import FileIcon from "../../../assets/icons/fileUploaded.svg"; // Replace with your actual path

const InvoicesList = () => {
    const invoices = [
        { fileName: "Invoice.2025/20.pdf", date: "Nov 02, 2025" },
        { fileName: "Invoice.2025/20.pdf", date: "Nov 02, 2025" },
        { fileName: "Invoice.2025/20.pdf", date: "Nov 02, 2025" },
        { fileName: "Invoice.2025/20.pdf", date: "Nov 02, 2025" },
        { fileName: "Invoice.2025/20.pdf", date: "Nov 02, 2025" },
    ];

    return (
        <div className="w-[95%] md:w-[88%] h-[481px] bg-white shadow-md rounded-lg p-6 font-lato">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <h2 className="text-black text-lg font-bold">Invoices 200</h2>
            </div>

            {/* Invoice List */}
            <div className="w-full mt-4 space-y-2">
                {invoices.map((invoice, index) => (
                    <div key={index} className="w-full h-[54px] bg-[#F7F8FA] rounded-md flex items-center px-4 justify-between">
                        {/* Left - File Icon & File Name */}
                        <div className="flex items-center gap-4">
                            <img src={FileIcon} alt="File" className="w-6 h-6" />
                            <span className="text-gray-700 text-sm">{invoice.fileName}</span>
                        </div>

                        {/* Right - Invoice Date */}
                        <div className="text-gray-600 text-sm">
                            <span className="font-bold">Date of invoice</span> {invoice.date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoicesList;
