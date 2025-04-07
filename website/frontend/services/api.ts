// API client for Book Bud recommendation system

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Book interface
export interface Book {
  ISBN: string;
  Title: string;
  Author: string;
  Year?: number;
  Publisher?: string;
  ImageURL?: string;
  Rating?: number;
}

// EDA Stats interface
export interface EDAStats {
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

// API Status interface
export interface ApiStatus {
  status: 'ready' | 'initializing';
  models: {
    content_based: boolean;
    collaborative_filtering: boolean;
    popularity_based: boolean;
  };
}

// API client class
class ApiClient {
  /**
   * Check if the API is ready
   */
  async getStatus(): Promise<ApiStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get API status:', error);
      throw error;
    }
  }

  /**
   * Get popular books
   */
  async getPopularBooks(params: { criteria?: string; limit?: number } = {}): Promise<Book[]> {
    try {
      const criteria = params.criteria || 'popularity_score';
      const limit = params.limit || 10;
      
      const response = await fetch(`${API_BASE_URL}/popular-books?criteria=${criteria}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get popular books:', error);
      throw error;
    }
  }

  /**
   * Get popular books by year
   */
  async getPopularBooksByYear(params: { year: number; criteria?: string; limit?: number }): Promise<Book[]> {
    try {
      const { year } = params;
      const criteria = params.criteria || 'popularity_score';
      const limit = params.limit || 10;
      
      const response = await fetch(`${API_BASE_URL}/popular-by-year?year=${year}&criteria=${criteria}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get popular books by year:', error);
      throw error;
    }
  }

  /**
   * Get popular books by publisher
   */
  async getPopularBooksByPublisher(params: { publisher: string; criteria?: string; limit?: number }): Promise<Book[]> {
    try {
      const { publisher } = params;
      const criteria = params.criteria || 'popularity_score';
      const limit = params.limit || 10;
      
      const response = await fetch(`${API_BASE_URL}/popular-by-publisher?publisher=${encodeURIComponent(publisher)}&criteria=${criteria}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get popular books by publisher:', error);
      throw error;
    }
  }

  /**
   * Get content-based recommendations
   */
  async getContentBasedRecommendations(
    params: {
      title?: string;
      isbn?: string;
      author?: string;
      limit?: number;
    }
  ): Promise<Book[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.title) queryParams.append('title', params.title);
      if (params.isbn) queryParams.append('isbn', params.isbn);
      if (params.author) queryParams.append('author', params.author);
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${API_BASE_URL}/content-based?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get content-based recommendations:', error);
      throw error;
    }
  }

  /**
   * Get collaborative filtering recommendations
   */
  async getCollaborativeRecommendations(
    params: {
      userId: number | string;
      method?: 'user' | 'item';
      limit?: number;
    }
  ): Promise<Book[]> {
    try {
      const { userId } = params;
      const method = params.method || 'user';
      const limit = params.limit || 10;
      
      const response = await fetch(`${API_BASE_URL}/collaborative-filtering?user_id=${userId}&method=${method}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get collaborative recommendations:', error);
      throw error;
    }
  }

  /**
   * Search for books
   */
  async searchBooks(params: { query: string; limit?: number }): Promise<Book[]> {
    try {
      const { query } = params;
      const limit = params.limit || 20;
      
      const response = await fetch(`${API_BASE_URL}/search-books?query=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to search books:', error);
      throw error;
    }
  }

  /**
   * Get EDA statistics
   */
  async getEDAStats(): Promise<EDAStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/eda-stats`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get EDA stats:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const api = new ApiClient();
