"use client";

import React from "react";
import { Book } from "@/services/api";
import { HoverEffect } from "./hover-effect";
// Using a simple X character instead of an icon
const IconX = ({ size }: { size?: number }) => (
  <span className="text-lg font-bold" style={{ fontSize: size ? `${size}px` : '20px' }}>×</span>
);

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  title: string;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  books,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-auto rounded-xl bg-gray-900 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
        >
          <IconX size={20} />
        </button>
        
        <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
        
        <div className="overflow-auto pb-4">
          <HoverEffect
            items={books.map((book) => ({
              title: book.Title,
              description: `by ${book.Author}${book.Year ? ` (${book.Year})` : ''} • ${book.Rating ? book.Rating.toFixed(1) : 'N/A'}`,
              link: `/book/${book.ISBN}`,
              image: book.ImageUrlL
            }))}
            className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          />
        </div>
      </div>
    </div>
  );
};
