const AboutUs = () => {
    return (
        <section className="bg-white p-6 rounded-lg shadow mt-20 relative">
            <h2 className="text-xl font-semibold mb-4">About Us</h2>
            <div className="flex justify-between items-start">
                {/* Left Section */}
                <div className="flex-1 mr-6 bg-[#F7F7F7] p-4">
                    <p className="text-[#7F7F7F]  text-decoration-skip-ink font-lato w-[488px] h-[208px] text-[16px] font-[700] leading-[19.2px] text-left underline-offset-4 text-decoration-skip-ink">
                        Paystack is a leading Nigerian payment processing platform that enables
                        businesses to accept online payments securely and efficiently. It offers
                        a wide range of payment solutions, including card payments, bank transfers,
                        and mobile money, to businesses across Africa.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-purple-600">LinkedIn</a>
                        <a href="#" className="text-purple-600">Facebook</a>
                        <a href="#" className="text-purple-600">Twitter</a>
                        <a href="#" className="text-purple-600">Instagram</a>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex-1 flex flex-col justify-between bg-[#F7F7F7] w-[482px] h-[208px] p-4 space-y-4 text-[#7F7F7F] font-lato text-[16px] font-[700] leading-[19.2px] text-left underline-offset-4 text-decoration-skip-ink">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center">
                            <span className="text-xs">💼</span>
                        </div>
                        <p className="font-semibold text-sm">Financial Technology (Fintech)</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center">
                            <span className="text-xs">🏢</span>
                        </div>
                        <p className="font-semibold text-sm">2000+ Employees</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center">
                            <span className="text-xs">🌍</span>
                        </div>
                        <p className="font-semibold text-sm">Lekki, Lagos State, Nigeria</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
