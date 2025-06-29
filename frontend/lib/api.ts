// API service for Syft-Datasets UI

export type Dataset = {
  id: string;
  name: string;
  email: string;
  syft_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  size: string;
  type: string;
  tags: string[];
};

export type ListDatasetsResponse = {
  datasets: Dataset[];
  total_count: number;
  unique_emails: string[];
  unique_names: string[];
};

// Get the base URL for API calls
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  // Server-side: use localhost (for SSR)
  return 'http://localhost:8001';
};

const BASE_URL = getBaseUrl();

export const apiService = {
  async getDatasets(): Promise<ListDatasetsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/datasets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch datasets:', error);
      throw error;
    }
  },

  async searchDatasets(keyword: string): Promise<ListDatasetsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/datasets/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to search datasets:', error);
      throw error;
    }
  },

  async filterByEmail(email_pattern: string): Promise<ListDatasetsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/datasets/filter-by-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_pattern }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to filter datasets by email:', error);
      throw error;
    }
  },

  async getUniqueEmails(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/datasets/emails`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch unique emails:', error);
      throw error;
    }
  },

  async getUniqueNames(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/datasets/names`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch unique names:', error);
      throw error;
    }
  },
}; 