"use client";

import React, { useState, useEffect } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { 
  IconChartBar, 
  IconChartPie, 
  IconChartHistogram, 
  IconChartDots, 
  IconBooks, 
  IconUsers, 
  IconStar 
} from "@tabler/icons-react";

interface EDAStats {
  total_books: number;
  total_users: number;
  total_ratings: number;
  avg_rating: number;
  rating_distribution: Record<string, number>;
  publication_years: {
    min: number;
    max: number;
    most_common: number;
  };
  top_authors: Record<string, number>;
  top_publishers: Record<string, number>;
}

export default function EDAPage() {
  const [stats, setStats] = useState<EDAStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const fetchEDAStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch("http://localhost:8000/eda-stats");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch EDA stats:", err);
        setError("Failed to load EDA statistics. Please try again later.");
        // Use mock data for development if API is not available
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEDAStats();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 relative">
      {/* Glowing effect around the margins */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowingEffect spread={100} glow={true} disabled={false} proximity={100} />
      </div>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Exploratory Data Analysis</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Insights and visualizations from the Book Bud dataset.
        </p>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4">Loading data analysis...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                title="Total Books" 
                value={stats?.total_books.toLocaleString() || "0"} 
                icon={<IconBooks className="h-8 w-8 text-blue-500" />}
              />
              <StatCard 
                title="Total Users" 
                value={stats?.total_users.toLocaleString() || "0"} 
                icon={<IconUsers className="h-8 w-8 text-green-500" />}
              />
              <StatCard 
                title="Total Ratings" 
                value={stats?.total_ratings.toLocaleString() || "0"} 
                icon={<IconStar className="h-8 w-8 text-yellow-500" />}
              />
              <StatCard 
                title="Average Rating" 
                value={(stats?.avg_rating || 0).toFixed(2)} 
                icon={<IconChartBar className="h-8 w-8 text-purple-500" />}
              />
            </div>
            
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <TabButton 
                  active={activeTab === "overview"} 
                  onClick={() => setActiveTab("overview")}
                  icon={<IconChartPie className="h-5 w-5" />}
                  label="Overview"
                />
                <TabButton 
                  active={activeTab === "ratings"} 
                  onClick={() => setActiveTab("ratings")}
                  icon={<IconChartHistogram className="h-5 w-5" />}
                  label="Ratings"
                />
                <TabButton 
                  active={activeTab === "authors"} 
                  onClick={() => setActiveTab("authors")}
                  icon={<IconUsers className="h-5 w-5" />}
                  label="Authors"
                />
                <TabButton 
                  active={activeTab === "publishers"} 
                  onClick={() => setActiveTab("publishers")}
                  icon={<IconBooks className="h-5 w-5" />}
                  label="Publishers"
                />
                <TabButton 
                  active={activeTab === "years"} 
                  onClick={() => setActiveTab("years")}
                  icon={<IconChartDots className="h-5 w-5" />}
                  label="Years"
                />
              </div>
              
              <div className="p-6">
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Dataset Overview</h2>
                    <p className="mb-4">
                      The Book Bud dataset contains information about books, users, and ratings. 
                      This exploratory data analysis provides insights into the characteristics and patterns within the data.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Publication Years</h3>
                        <p>Earliest: {stats?.publication_years.min}</p>
                        <p>Latest: {stats?.publication_years.max}</p>
                        <p>Most Common: {stats?.publication_years.most_common}</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Rating Distribution</h3>
                        <div className="flex items-end h-32 mt-2">
                          {stats && Object.entries(stats.rating_distribution)
                            .sort(([a], [b]) => parseInt(a) - parseInt(b))
                            .map(([rating, count]) => {
                              const maxCount = Math.max(...Object.values(stats.rating_distribution));
                              const height = (count / maxCount) * 100;
                              
                              return (
                                <div key={rating} className="flex flex-col items-center flex-1">
                                  <div 
                                    className="w-full bg-blue-500 rounded-t"
                                    style={{ height: `${height}%` }}
                                  ></div>
                                  <span className="text-xs mt-1">{rating}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-medium mb-2">Visualization Images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <img 
                          src="/eda_output/original_rating_distribution.png" 
                          alt="Rating Distribution" 
                          className="w-full h-auto rounded-lg shadow-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/600x400?text=Rating+Distribution+Chart";
                          }}
                        />
                        <img 
                          src="/eda_output/user_activity_distribution.png" 
                          alt="User Activity Distribution" 
                          className="w-full h-auto rounded-lg shadow-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/600x400?text=User+Activity+Chart";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "ratings" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Rating Analysis</h2>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                      <h3 className="font-medium mb-2">Rating Distribution</h3>
                      <div className="flex items-end h-48 mt-2">
                        {stats && Object.entries(stats.rating_distribution)
                          .sort(([a], [b]) => parseInt(a) - parseInt(b))
                          .map(([rating, count]) => {
                            const maxCount = Math.max(...Object.values(stats.rating_distribution));
                            const height = (count / maxCount) * 100;
                            const percentage = ((count / stats.total_ratings) * 100).toFixed(1);
                            
                            return (
                              <div key={rating} className="flex flex-col items-center flex-1">
                                <div className="text-xs mb-1">{count.toLocaleString()}</div>
                                <div 
                                  className="w-full bg-blue-500 rounded-t"
                                  style={{ height: `${height}%` }}
                                ></div>
                                <div className="text-xs mt-1">{rating}</div>
                                <div className="text-xs">{percentage}%</div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Rating Statistics</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Average Rating: {(stats?.avg_rating || 0).toFixed(2)}</li>
                          <li>Total Ratings: {stats?.total_ratings.toLocaleString()}</li>
                          <li>Ratings per User: {stats && (stats.total_ratings / stats.total_users).toFixed(2)}</li>
                          <li>Ratings per Book: {stats && (stats.total_ratings / stats.total_books).toFixed(2)}</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Visualization</h3>
                        <img 
                          src="/eda_output/filtered_rating_distribution.png" 
                          alt="Filtered Rating Distribution" 
                          className="w-full h-auto rounded-lg shadow-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/600x400?text=Filtered+Rating+Distribution";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "authors" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Top Authors</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Number of Books</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {stats && Object.entries(stats.top_authors)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 10)
                            .map(([author, count], index) => (
                              <tr key={author}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{count}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-medium mb-2">Author Distribution</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="h-64">
                          {/* Placeholder for author distribution chart */}
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Author distribution visualization would appear here
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "publishers" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Top Publishers</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Publisher</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Number of Books</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {stats && Object.entries(stats.top_publishers)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 10)
                            .map(([publisher, count], index) => (
                              <tr key={publisher}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{publisher}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{count}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-medium mb-2">Publisher Visualization</h3>
                      <img 
                        src="/eda_output/top_publishers.png" 
                        alt="Top Publishers" 
                        className="w-full h-auto rounded-lg shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/800x400?text=Top+Publishers+Chart";
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {activeTab === "years" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Publication Year Analysis</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Publication Year Range</h3>
                        <p>Earliest Year: {stats?.publication_years.min}</p>
                        <p>Latest Year: {stats?.publication_years.max}</p>
                        <p>Most Common Year: {stats?.publication_years.most_common}</p>
                        <p>Range: {stats && (stats.publication_years.max - stats.publication_years.min)} years</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Year Distribution</h3>
                        <div className="h-32">
                          {/* Placeholder for year distribution visualization */}
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Year distribution visualization would appear here
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Publication Year Visualization</h3>
                      <img 
                        src="/eda_output/publication_year_distribution.png" 
                        alt="Publication Year Distribution" 
                        className="w-full h-auto rounded-lg shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/800x400?text=Publication+Year+Distribution";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Visualizations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Visualizations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Similarity Distribution</h3>
                  <img 
                    src="/eda_output/cf_similarity_distribution.png" 
                    alt="Collaborative Filtering Similarity Distribution" 
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/600x400?text=Similarity+Distribution";
                    }}
                  />
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Content-Based Similarity</h3>
                  <img 
                    src="/eda_output/content_avg_similarity_distribution.png" 
                    alt="Content-Based Similarity Distribution" 
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/600x400?text=Content+Similarity";
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center">
        <div className="mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean, 
  onClick: () => void, 
  icon: React.ReactNode, 
  label: string 
}) => {
  return (
    <button
      className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 focus:outline-none ${
        active
          ? "border-blue-500 text-blue-600 dark:text-blue-400"
          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

// Mock data for development
const mockStats: EDAStats = {
  total_books: 271360,
  total_users: 278858,
  total_ratings: 1149780,
  avg_rating: 7.75,
  rating_distribution: {
    "1": 37142,
    "2": 24624,
    "3": 38076,
    "4": 52892,
    "5": 111865,
    "6": 114293,
    "7": 154924,
    "8": 223286,
    "9": 156621,
    "10": 236057
  },
  publication_years: {
    min: 1900,
    max: 2022,
    most_common: 2002
  },
  top_authors: {
    "Stephen King": 164,
    "J.K. Rowling": 62,
    "John Grisham": 45,
    "Danielle Steel": 42,
    "Dean Koontz": 39,
    "Nora Roberts": 37,
    "Tom Clancy": 29,
    "James Patterson": 28,
    "Terry Pratchett": 27,
    "Michael Crichton": 26
  },
  top_publishers: {
    "Penguin Books": 1563,
    "Ballantine Books": 842,
    "Pocket Books": 765,
    "Bantam Books": 750,
    "HarperCollins Publishers": 649,
    "Vintage": 644,
    "Warner Books": 539,
    "Signet Book": 518,
    "Avon Books": 493,
    "Dell": 489
  }
};
