import { Person4, Person5, Person6, Person7 } from "../assets/images.ts";

interface Testimonial {
  id: number;
  image: string;
  testimonial: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    image: Person4,
    testimonial:
      "I had been struggling to find the right job for months, but this platform changed everything. The personalized approach helped me discover opportunities that truly matched my skills.",
  },
  {
    id: 2,
    image: Person5,
    testimonial:
      "I had been struggling to find the right job for months, but this platform changed everything. The personalized approach helped me discover opportunities that truly matched my skills and interests. Within weeks, I secured a position I’m passionate about.",
  },
  {
    id: 3,
    image: Person6,
    testimonial:
      "I had been struggling to find the right job for months, but this platform changed everything. The personalized approach helped me discover opportunities that truly matched my skills and interests. Within weeks.",
  },
  {
    id: 4,
    image: Person7,
    testimonial:
      "I had been struggling to find the right job for months, but this platform changed everything. The personalized approach helped me discover opportunities that truly matched my skills and interests.",
  },
  {
    id: 5,
    image: Person4,
    testimonial:
      "I had been struggling to find the right job for months, but this platform changed everything. The personalized approach helped me discover opportunities that truly matched my skills and interests.",
  },
  {
    id: 6,
    image: Person5,
    testimonial:
      "I had been struggling to find the right job for months, but this platform changed everything. The personalized approach helped me discover opportunities that truly matched my skills and interests.",
  },
  {
    id: 7,
    image: Person7,
    testimonial:
      "I had been struggling to find the right job for months, but this platform changed everything. The personalized approach helped me discover opportunities that truly matched my skills and interests.",
  },
];

export default testimonials;
