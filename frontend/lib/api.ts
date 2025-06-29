import { formatBytes } from "./utils";

export type SyftDataset = {
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
  datasets: SyftDataset[];
  total_count: number;
  unique_emails: string[];
  unique_names: string[];
};

export interface Job {
  id: number;
  datasetName: string;
  projectName: string;
  description: string;
  requestedTime: Date;
  requesterEmail: string;
  status: "pending" | "approved" | "denied";
}

export interface Dataset {
  id: number;
  name: string;
  description: string;
  size: string;
  type: string;
  createdAt: Date;
  lastUpdated: Date;
  accessRequests: number;
  permissions: string[];
  usersCount: number;
  requestsCount: number;
  activityData: number[];
}

interface DatasetResponse {
  uid: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  name: string;
  private: string;
  privateSize: number;
  mock: string;
  mockSize: number;
  summary: string;
  readme: string;
  tags: string[];
  runtime: {
    cmd: string[];
    imageName: string | null;
    mountDir: string | null;
  };
  autoApproval: string[];
}

interface DatasetListResponse {
  datasets: DatasetResponse[];
}

interface JobStatus {
  pending_code_review: "pending_code_review";
  job_run_failed: "job_run_failed";
  job_run_finished: "job_run_finished";
  rejected: "rejected";
  shared: "shared";
  approved: "approved";
}

const pendingStatuses = ["pending_code_review", "job_run_failed"] as const;
const approvedStatuses = ["shared", "approved", "job_run_finished"] as const;
const deniedStatuses = ["rejected"] as const;

interface JobResponse {
  uid: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  name: string;
  description: string;
  userCodeId: string;
  tags: string[];
  userMetadata: Record<string, string>;
  status: JobStatus;
  error: string;
  errorMessage: string | null;
  outputUrl: string;
  datasetName: string;
  enclave: string;
}

interface JobListResponse {
  jobs: JobResponse[];
}

interface AutoApproveResponse {
  datasites: string[];
}

// Get the base URL for API calls
const getBaseUrl = () => {
  // Always use localhost:8001 for the syft-datasets backend
  return 'http://localhost:8001';
};

const BASE_URL = getBaseUrl();

export const apiService = {
  async getDatasets(): Promise<{ datasets: Dataset[] }> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/datasets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ListDatasetsResponse = await response.json();
      
      // Convert syft-datasets format to organic-coop format for compatibility
      return {
        datasets: data.datasets.map((dataset, index) => ({
          id: index + 1,
          name: dataset.name,
          description: dataset.description,
          size: dataset.size,
          type: dataset.type,
          createdAt: new Date(dataset.created_at),
          lastUpdated: new Date(dataset.updated_at),
          accessRequests: 0,
          permissions: [dataset.email], // Use the actual email from the dataset
          usersCount: Math.floor(Math.random() * 10) + 1, // Mock data
          requestsCount: Math.floor(Math.random() * 5), // Mock data
          activityData: Array(12).fill(0).map(() => Math.floor(Math.random() * 10)), // Mock activity data
        }))
      };
    } catch (error) {
      console.error('Failed to fetch datasets:', error);
      throw error;
    }
  },

  async createDataset(formData: FormData): Promise<{ success: boolean; message: string }> {
    // Mock implementation for compatibility
    return {
      success: true,
      message: `Dataset "${formData.get("name")}" created successfully (mock)`,
    };
  },

  async getJobs(): Promise<{ jobs: Job[] }> {
    // Mock jobs data for compatibility
    return {
      jobs: [
        {
          id: 1,
          datasetName: "Sample Dataset",
          projectName: "Sample Project",
          description: "Mock job for demonstration",
          requestedTime: new Date(),
          requesterEmail: "user@example.com",
          status: "pending"
        }
      ]
    };
  },

  async getAutoApprovedDatasites(): Promise<{ datasites: string[] }> {
    // Mock implementation
    return { datasites: [] };
  },

  async setAutoApprovedDatasites(datasites: string[]): Promise<{ message: string }> {
    // Mock implementation
    return { message: "Auto-approved datasites updated (mock)" };
  },

  async deleteDataset(datasetName: string): Promise<{ message: string }> {
    // Mock implementation
    return { message: `Dataset "${datasetName}" deleted (mock)` };
  },

  async downloadDatasetPrivate(datasetUid: string): Promise<Response> {
    // Mock implementation
    return new Response("Mock dataset content", { status: 200 });
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
