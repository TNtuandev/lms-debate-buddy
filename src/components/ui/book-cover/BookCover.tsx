import { cn } from '@/lib/utils';
import {motion} from 'framer-motion';
import { ArrowRight } from 'iconsax-react';
import React from 'react';

type Props = {
  imageUrl: string;
  active?: boolean
};

export const BookCover = ({ imageUrl, active }: Props) => {
  return (
    <motion.div
      whileHover={{
      scale: 1.05,
      transition: {duration: 0.3},
    }}>
      <motion.div
        initial={{y: 0, opacity: 1}}
        animate={active ? {y: -20, opacity: 1} : {}}
        transition={{duration: 0.5}}
        className={cn(`relative z-20 w-full h-full max-w-[284px] cursor-pointer`)}

      >
        <div className={cn("relative rounded-3xl overflow-hidden shadow-md", {
          'rounded-b-none': active,
        })}>
          <img
            src={imageUrl}
            alt={imageUrl}
            className="w-full aspect-[3/4] "
          />
          <div style={{
            background: 'linear-gradient(90deg, rgba(2, 0, 36, 0.16) 0%, rgba(0, 0, 0, 0.2) 1.8%, rgba(255, 255, 255, 0.144) 3.2%, rgba(0, 0, 0, 0.132) 5%, rgba(247, 254, 255, 0.112) 10%, rgba(255, 255, 255, 0) 50%)'
          }} className="rounded-3xl absolute w-full h-full top-0 bottom-0 left-0 right-0"></div>

        </div>
        <motion.div
          initial={{y: -40, opacity: 0}}
          animate={active ? {y: -22, opacity: 1} : {}}
          transition={{duration: 0.5}}
          className="z-30 h-12 w-12 rounded-full absolute p-3 bg-zinc-900 right-6">
          <ArrowRight size={24} color="white" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{y: -40, opacity: 0}}
        animate={active ? {y: -20, opacity: 1} : {}}
        transition={{duration: 0.5}}
        className="cursor-pointer relative z-10"
      >
        <motion.div
          className="rounded-bl-3xl rounded-br-3xl bg-primary h-12 left-0 right-0 bottom-0 px-6 py-3"
        >
          Sách thịnh hành
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
