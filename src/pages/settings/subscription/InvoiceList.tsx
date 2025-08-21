import { RiFileTextLine, RiDownloadLine, RiEyeLine, RiCalendarLine } from "react-icons/ri";

interface Invoice {
  fileName: string;
  date: string;
  amount?: string;
  status?: 'paid' | 'pending' | 'overdue';
}

const InvoicesList = () => {
  const invoices: Invoice[] = [
    { fileName: "Invoice.2025/20.pdf", date: "Nov 02, 2025", amount: "$29.99", status: 'paid' },
    { fileName: "Invoice.2025/19.pdf", date: "Oct 02, 2025", amount: "$29.99", status: 'paid' },
    { fileName: "Invoice.2025/18.pdf", date: "Sep 02, 2025", amount: "$29.99", status: 'paid' },
    { fileName: "Invoice.2025/17.pdf", date: "Aug 02, 2025", amount: "$29.99", status: 'paid' },
    { fileName: "Invoice.2025/16.pdf", date: "Jul 02, 2025", amount: "$29.99", status: 'paid' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (fileName: string) => {
    // Handle download logic
    console.log('Downloading:', fileName);
  };

  const handleView = (fileName: string) => {
    // Handle view logic
    console.log('Viewing:', fileName);
  };

  return (
    <section className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
      {/* Section Divider */}
      <hr className="mb-8 border-gray-200" />

      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <RiFileTextLine className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Billing History
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          View and download your payment invoices and billing statements.
        </p>
      </div>

      {/* Invoices Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Invoices</h3>
              <p className="text-sm text-gray-600 mt-1">
                {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <RiCalendarLine className="h-4 w-4" />
              <span>Last 12 months</span>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="divide-y divide-gray-100">
          {invoices.length > 0 ? (
            invoices.map((invoice, index) => (
              <div
                key={index}
                className="p-6 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  {/* Left - File Info */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <RiFileTextLine className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {invoice.fileName}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Date: {invoice.date}
                        </span>
                        {invoice.amount && (
                          <span className="text-sm font-medium text-gray-900">
                            {invoice.amount}
                          </span>
                        )}
                        {invoice.status && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(invoice.fileName)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      title="View Invoice"
                    >
                      <RiEyeLine className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(invoice.fileName)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-150"
                      title="Download Invoice"
                    >
                      <RiDownloadLine className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RiFileTextLine className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500">
                Your billing history will appear here once you have active subscriptions.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InvoicesList;