const EmployeesTestimonial = () => {
  const testimonials = [
    {
      initials: "MU",
      name: "Maryam Umar",
      position: "Senior Product Designer",
      message:
        "Working at Paystack has been an amazing experience, with a culture that encourages innovation and personal growth. I'm proud to be part of a team that's transforming the payments landscape in Africa.",
    },
    {
      initials: "MU",
      name: "Maryam Umar",
      position: "Senior Product Designer",
      message:
        "Working at Paystack has been an amazing experience, with a culture that encourages innovation and personal growth. I'm proud to be part of a team that's transforming the payments landscape in Africa.",
    },
  ];

  return (
    <section className="w-full rounded-lg bg-gray-100 p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Employees Testimonial</h2>
      <div className="flex flex-col gap-y-4 md:flex-row md:space-x-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative flex h-[198px] w-full flex-col rounded-bl-none rounded-br-[10px] rounded-tl-none rounded-tr-[10px] bg-[#F7F7F7] p-4 shadow md:w-[409px] md:flex-wrap"
          >
            {/* Purple side feature joined with the box */}
            <div className="absolute left-0 top-0 h-full w-[10px] bg-[#6B5AED]"></div>

            <div className="mb-4 flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B5AED] text-white">
                {testimonial.initials}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-[#6B5AED]">{testimonial.position}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">{testimonial.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmployeesTestimonial;
