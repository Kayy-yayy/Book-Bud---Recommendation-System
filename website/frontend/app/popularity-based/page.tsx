"use client";

import React, { useState, useEffect } from "react";
import { TracingBeam } from "../../components/ui/tracing-beam";
import { HoverEffect } from "@/components/ui/hover-effect";
import { BookModal } from "@/components/ui/book-modal";
import { 
  IconBook, 
  IconStar, 
  IconFilter, 
  IconCalendar, 
  IconBuilding,
} from "@tabler/icons-react";

// Simple arrow right component
const IconArrowRight = ({ size }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 16} 
    height={size || 16} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M5 12h14"></path>
    <path d="M12 5l7 7-7 7"></path>
  </svg>
);
import { Book, api } from "@/services/api";

export default function PopularityBasedPage() {
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [decadeBooks, setDecadeBooks] = useState<Record<string, Book[]>>({});
  const [activeDecade, setActiveDecade] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decades, setDecades] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPopularBooks();
    fetchBooksByDecade();
  }, []);

  const fetchPopularBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, fetch from API
      // const data = await api.getPopularBooks({ criteria: "overall", limit: 100 });
      
      // For development, use mock data
      const data = [...mockBooks];
      
      setTopBooks(data);
      
      if (data.length === 0) {
        setError("No books found");
      }
    } catch (err) {
      console.error("Failed to fetch popular books:", err);
      setError("Failed to load popular books. Please try again later.");
      setTopBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksByDecade = async () => {
    try {
      // In a real implementation, you would fetch books by decade from the API
      // For now, we'll use mock data and organize it by decade
      const allBooks = [...mockBooks];
      const decadeMap: Record<string, Book[]> = {};
      const decadeList: string[] = [];
      
      allBooks.forEach(book => {
        if (book.Year) {
          const decade = Math.floor(book.Year / 10) * 10;
          const decadeKey = `${decade}s`;
          
          if (!decadeMap[decadeKey]) {
            decadeMap[decadeKey] = [];
            decadeList.push(decadeKey);
          }
          
          if (decadeMap[decadeKey].length < 10) {
            decadeMap[decadeKey].push(book);
          }
        }
      });
      
      setDecadeBooks(decadeMap);
      setDecades(decadeList.sort());
      if (decadeList.length > 0) {
        setActiveDecade(decadeList[decadeList.length - 1]);
      }
    } catch (err) {
      console.error("Failed to fetch books by decade:", err);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4 md:px-8 relative">
      <TracingBeam className="w-full max-w-6xl mx-auto">
        <div className="w-full mx-auto">
          
          {/* Section 1: Top 100 Popular Books */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-white">Top 100 Popular Books</h1>
              <button 
                onClick={toggleModal}
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span className="mr-1">View All</span>
                <IconArrowRight size={16} />
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-300">Loading popular books...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">
                <p>{error}</p>
              </div>
            ) : (
              <div className="w-full">
                <HoverEffect
                  items={topBooks.slice(0, 6).map((book) => ({
                    title: book.Title,
                    description: `by ${book.Author}${book.Year ? ` (${book.Year})` : ''} • ${book.Rating ? book.Rating.toFixed(1) : 'N/A'}`,
                    link: `/book/${book.ISBN}`,
                    image: book.ImageUrlL
                  }))}
                  className="grid-cols-3 max-w-5xl mx-auto grid-rows-2"
                />
              </div>
            )}
            
            {/* Modal for viewing all books */}
            <BookModal 
              isOpen={modalOpen} 
              onClose={toggleModal} 
              books={topBooks} 
              title="Top 100 Popular Books"
            />
          </section>
          
          {/* Section 2: Top 10 Books Per Decade */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-6">Filter by Decade</h1>
            
            {/* Decade selector */}
            <div className="flex flex-wrap gap-2 mb-8">
              {decades.map((decade) => (
                <button
                  key={decade}
                  onClick={() => setActiveDecade(decade)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeDecade === decade ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {decade}
                </button>
              ))}
            </div>
            
            {activeDecade && decadeBooks[activeDecade] && (
              <div className="w-full">
                <HoverEffect
                  items={decadeBooks[activeDecade].slice(0, 3).map((book) => ({
                    title: book.Title,
                    description: `by ${book.Author}${book.Year ? ` (${book.Year})` : ''} • ${book.Rating ? book.Rating.toFixed(1) : 'N/A'}`,
                    link: `/book/${book.ISBN}`,
                    image: book.ImageUrlL
                  }))}
                  className="grid-cols-3 max-w-5xl mx-auto"
                />
              </div>
            )}
          </section>

          {/* Section 3: About Popularity-Based Recommendation */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-white mb-6">About Popularity-Based Recommendation</h1>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
              <p className="text-gray-300 mb-6">
                The popularity-based recommender is one of the simplest yet effective recommendation approaches. It doesn't personalize recommendations for individual users but instead recommends items that are generally popular among all users.
              </p>
              
              <h3 className="text-xl font-medium text-white mt-6 mb-4">Methodology</h3>
              <p className="text-gray-300 mb-4">
                The popularity-based recommendation system relies on statistical aggregation and weighted scoring to rank items based on their popularity:
              </p>
              
              <h4 className="text-lg font-medium text-blue-300 mt-5 mb-2">Aggregating Ratings:</h4>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1 ml-2">
                <li>Ratings are grouped by item identifiers (e.g., ISBN for books).</li>
                <li>Both the count and mean of ratings are calculated for each item.</li>
              </ul>
              
              <h4 className="text-lg font-medium text-blue-300 mt-5 mb-2">Filtering Items:</h4>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1 ml-2">
                <li>Items with fewer than a specified minimum number of ratings (default: 10) are excluded to ensure statistical significance.</li>
              </ul>
              
              <h4 className="text-lg font-medium text-blue-300 mt-5 mb-2">Weighted Scoring:</h4>
              <p className="text-gray-300 mb-3">
                A weighted rating formula is applied, known as the "Bayesian average" or "IMDB formula":
              </p>
              
              <div className="bg-gray-800 p-5 rounded-md mb-5 flex justify-center">
                <div className="text-gray-100 font-mono text-lg">
                  Weighted Rating = (v/(v+m) · R) + (m/(v+m) · C)
                </div>
              </div>
              
              <p className="text-gray-300 mb-2">Where:</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1 ml-2">
                <li><strong>v</strong>: Number of ratings for the item.</li>
                <li><strong>m</strong>: Minimum ratings required for inclusion.</li>
                <li><strong>R</strong>: Average rating of the item.</li>
                <li><strong>C</strong>: Mean rating across all items.</li>
              </ul>
              
              <p className="text-gray-300 mb-4">
                This formula balances an item's own average rating with the overall mean rating. Items with many ratings rely more on their own average, while those with fewer ratings are pulled toward the overall mean.
              </p>
              
              <h4 className="text-lg font-medium text-blue-300 mt-5 mb-2">Merging with Item Details:</h4>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1 ml-2">
                <li>Popularity metrics are combined with item-specific information (e.g., title, author, description) to provide enriched recommendations.</li>
              </ul>
              
              <h3 className="text-xl font-medium text-white mt-8 mb-4">Why It Matters</h3>
              <p className="text-gray-300 mb-3">
                Popularity-based recommendations play an essential role in enhancing user experience and supporting business goals:
              </p>
              
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 ml-2">
                <li><strong>Cold Start Solution</strong>: Provides meaningful suggestions for new users or items without requiring prior interactions.</li>
                <li><strong>Fairness in Ranking</strong>: Prevents items with few ratings from dominating rankings due to artificially high averages.</li>
                <li><strong>Universal Appeal</strong>: Ensures recommendations resonate with a broad audience.</li>
                <li><strong>Efficiency</strong>: Its simplicity makes it computationally efficient and easy to deploy.</li>
              </ul>
            </div>
          </section>
        </div>
      </TracingBeam>
    </div>
  );
}

// Mock data for development
const mockBooks: Book[] = [
  {
    ISBN: "0971880107",
    Title: "The Alchemist",
    Author: "Paulo Coelho",
    Year: 1988,
    Publisher: "HarperOne",
    Rating: 4.5,
    ImageUrlS: "http://images.amazon.com/images/P/0971880107.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0971880107.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0971880107.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0439554934",
    Title: "Harry Potter and the Sorcerer's Stone",
    Author: "J.K. Rowling",
    Year: 1997,
    Publisher: "Scholastic",
    Rating: 4.7,
    ImageUrlS: "http://images.amazon.com/images/P/0439554934.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0439554934.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0439554934.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0618260307",
    Title: "The Hobbit",
    Author: "J.R.R. Tolkien",
    Year: 1937,
    Publisher: "Houghton Mifflin",
    Rating: 4.6,
    ImageUrlS: "http://images.amazon.com/images/P/0618260307.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0618260307.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0618260307.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0679783261",
    Title: "Pride and Prejudice",
    Author: "Jane Austen",
    Year: 1813,
    Publisher: "Penguin Books",
    Rating: 4.4,
    ImageUrlS: "http://images.amazon.com/images/P/0679783261.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0679783261.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0679783261.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0385504209",
    Title: "The Da Vinci Code",
    Author: "Dan Brown",
    Year: 2003,
    Publisher: "Doubleday",
    Rating: 4.1,
    ImageUrlS: "http://images.amazon.com/images/P/0385504209.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0385504209.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0385504209.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0312195516",
    Title: "The Red Tent",
    Author: "Anita Diamant",
    Year: 1998,
    Publisher: "Picador USA",
    Rating: 4.3,
    ImageUrlS: "http://images.amazon.com/images/P/0312195516.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0312195516.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0312195516.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0142001740",
    Title: "The Secret Life of Bees",
    Author: "Sue Monk Kidd",
    Year: 2002,
    Publisher: "Penguin Books",
    Rating: 4.2,
    ImageUrlS: "http://images.amazon.com/images/P/0142001740.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0142001740.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0142001740.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0307277674",
    Title: "The Kite Runner",
    Author: "Khaled Hosseini",
    Year: 2003,
    Publisher: "Riverhead Books",
    Rating: 4.6,
    ImageUrlS: "http://images.amazon.com/images/P/0307277674.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0307277674.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0307277674.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0316769177",
    Title: "The Catcher in the Rye",
    Author: "J.D. Salinger",
    Year: 1951,
    Publisher: "Little, Brown and Company",
    Rating: 4.0,
    ImageUrlS: "http://images.amazon.com/images/P/0316769177.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0316769177.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0316769177.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0061120081",
    Title: "To Kill a Mockingbird",
    Author: "Harper Lee",
    Year: 1960,
    Publisher: "HarperCollins",
    Rating: 4.8,
    ImageUrlS: "http://images.amazon.com/images/P/0061120081.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0061120081.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0061120081.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0143039954",
    Title: "The Road",
    Author: "Cormac McCarthy",
    Year: 2006,
    Publisher: "Vintage Books",
    Rating: 4.1,
    ImageUrlS: "http://images.amazon.com/images/P/0143039954.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0143039954.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0143039954.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0452284244",
    Title: "1984",
    Author: "George Orwell",
    Year: 1949,
    Publisher: "Signet Classics",
    Rating: 4.5,
    ImageUrlS: "http://images.amazon.com/images/P/0452284244.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0452284244.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0452284244.01.LZZZZZZZ.jpg"
  }
];
