// Minimal API service stub for Syft-Datasets UI

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

export const apiService = {
  async getDatasets() {
    // Replace with real API call
    return { datasets: [], unique_emails: [], total_count: 0 };
  },
  async searchDatasets(_keyword: string) {
    // Replace with real API call
    return { datasets: [], unique_emails: [], total_count: 0 };
  },
  async filterByEmail(_email: string) {
    // Replace with real API call
    return { datasets: [], unique_emails: [], total_count: 0 };
  },
}; 