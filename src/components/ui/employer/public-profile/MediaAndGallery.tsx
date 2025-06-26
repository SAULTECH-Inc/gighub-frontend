import { EmployerData } from "../../../../utils/types";
import React from "react";
import { motion } from "framer-motion";

interface MediaAndGalleryProps {
  user: EmployerData;
}

const MediaAndGallery: React.FC<MediaAndGalleryProps> = ({ user }) => {
  return (
    <section className="w-full rounded-lg bg-white p-6 shadow">
      <h2 className="font-lato mb-4 text-xl">Media and Gallery</h2>
      <div className="flex grid-cols-3 flex-wrap gap-4">
        {user?.brandAndVisuals &&
          user.brandAndVisuals.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="h-[160px] w-[170px] cursor-pointer rounded border border-[#E6E6E6] bg-[#D9D9D9] p-1"
            >
              <img
                src={url}
                alt="visuals"
                className="h-full w-full rounded object-cover"
              />
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default MediaAndGallery;
