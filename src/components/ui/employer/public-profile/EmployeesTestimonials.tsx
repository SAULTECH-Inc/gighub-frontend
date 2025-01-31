const EmployeesTestimonial = () => {
    const testimonials = [
        {
            initials: 'MU',
            name: 'Maryam Umar',
            position: 'Senior Product Designer',
            message:
                "Working at Paystack has been an amazing experience, with a culture that encourages innovation and personal growth. I'm proud to be part of a team that's transforming the payments landscape in Africa.",
        },
        {
            initials: 'MU',
            name: 'Maryam Umar',
            position: 'Senior Product Designer',
            message:
                "Working at Paystack has been an amazing experience, with a culture that encourages innovation and personal growth. I'm proud to be part of a team that's transforming the payments landscape in Africa.",
        },
    ];

    return (
        <section className="bg-gray-100 p-6 rounded-lg shadow mb-12">
            <h2 className="text-xl font-semibold mb-4">Employees Testimonial</h2>
            <div className="flex space-x-8">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="flex flex-col p-4 w-[409px] h-[198px] shadow bg-[#F7F7F7] relative rounded-tl-none rounded-tr-[10px] rounded-br-[10px] rounded-bl-none"
                    >
                        {/* Purple side feature joined with the box */}
                        <div className="absolute top-0 left-0 h-full w-[10px]  bg-[#6B5AED]"></div>

                        <div className="flex items-center  mb-4">
                            <div className="w-12 h-12 bg-[#6B5AED]  text-white flex items-center justify-center rounded-full">
                                {testimonial.initials}
                            </div>
                            <div className="ml-4">
                                <h3 className="font-semibold">{testimonial.name}</h3>
                                <p className="text-[#6B5AED] text-sm">{testimonial.position}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm">{testimonial.message}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EmployeesTestimonial;
