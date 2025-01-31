
const ContactInformation = () => {
    return (
        <section className="bg-gray-100 p-6 rounded-lg shadow mb-12">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-6 h-6 bg-[#6B5AED] text-white flex items-center justify-center rounded-full">
                    <span className="text-xs">📧</span>
                </div>
                <p className="text-gray-700 text-sm">fundy@customerservice.com</p>
            </div>
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-6 h-6 bg-[#6B5AED] text-white flex items-center justify-center rounded-full">
                    <span className="text-xs">📞</span>
                </div>
                <p className="text-gray-700 text-sm">0701197384646</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-[#6B5AED] text-white flex items-center justify-center rounded-full">
                    <span className="text-xs">🏠</span>
                </div>
                <p className="text-gray-700 text-sm">122, lekki street, Lagos state, Nigeria.</p>
            </div>
        </section>
    );
};

export default ContactInformation;
