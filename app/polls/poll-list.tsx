"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Clock, ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns"; // Pour formatter la date (npm install date-fns)

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      // Les children apparaîtront un par un
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

interface Poll {
  id: string;
  title: string;
  description?: string | null;
  createdAt?: string | Date; // selon votre config
  location?: string | null;
  likes?: number;
  dislikes?: number;
}

interface PollListProps {
  polls: Poll[];
}

export default function PollList({ polls }: PollListProps) {
  return (
      <AnimatePresence>
        {polls.length === 0 ? (
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
              Vous n’avez pas encore créé de sondage.
            </motion.p>
        ) : (
            <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="space-y-3"
            >
              {polls.map((poll) => (
                  <PollItem key={poll.id} poll={poll} />
              ))}
            </motion.ul>
        )}
      </AnimatePresence>
  );
}

// -- Composant d'un item de sondage --
function PollItem({ poll }: { poll: Poll }) {
  // On peut gérer localement les likes/dislikes pour la démo
  const [likes, setLikes] = useState<number>(poll.likes ?? 0);
  const [dislikes, setDislikes] = useState<number>(poll.dislikes ?? 0);

  const handleLike = () => {
    // Vous pouvez faire un appel API pour sauvegarder en bdd
    setLikes((prev) => prev + 1);
  };

  const handleDislike = () => {
    // Idem, un appel API côté serveur pour sauvegarder
    setDislikes((prev) => prev + 1);
  };

  const createdAt =
      poll.createdAt instanceof Date
          ? poll.createdAt
          : new Date(poll.createdAt || "");

  return (
      <motion.li
          variants={itemVariants}
          layout
          className="bg-card border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
      >
        {/* Titre + Description */}
        <Link href={`/polls/${poll.id}`} className="block">
          <h2 className="text-xl font-semibold">{poll.title}</h2>
          {poll.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {poll.description}
              </p>
          )}
        </Link>

        {/* Lieu + Date */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {/* Si pas de location en bdd, on affiche un lieu fictif */}
            <span>{poll.location || "Paris, France"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {/* Formatage de la date via date-fns */}
            <span>{format(createdAt, "dd/MM/yyyy HH:mm")}</span>
          </div>
        </div>

        {/* Actions Like / Dislike */}
        <div className="mt-3 flex items-center gap-4">
          <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="inline-flex items-center gap-1 text-sm"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{likes}</span>
          </motion.button>
          <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleDislike}
              className="inline-flex items-center gap-1 text-sm"
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{dislikes}</span>
          </motion.button>
        </div>
      </motion.li>
  );
}
