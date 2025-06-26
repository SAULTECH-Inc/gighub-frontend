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
    <div className="font-lato h-[481px] w-[95%] rounded-lg bg-white p-6 shadow-md md:w-[88%]">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Invoices 200</h2>
      </div>

      {/* Invoice List */}
      <div className="mt-4 w-full space-y-2">
        {invoices.map((invoice, index) => (
          <div
            key={index}
            className="flex h-[54px] w-full items-center justify-between rounded-md bg-[#F7F8FA] px-4"
          >
            {/* Left - File Icon & File Name */}
            <div className="flex items-center gap-4">
              <img src={FileIcon} alt="File" className="h-6 w-6" />
              <span className="text-sm text-gray-700">{invoice.fileName}</span>
            </div>

            {/* Right - Invoice Date */}
            <div className="text-sm text-gray-600">
              <span className="font-bold">Date of invoice</span> {invoice.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicesList;
