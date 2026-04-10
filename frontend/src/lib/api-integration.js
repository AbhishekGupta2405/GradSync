// API Integration for GradSync - Connect to real NBA 2025 data
// Replace the mock data in your components with these API calls

const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage (set after login)
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// API headers with authentication
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// Alumni API calls
export const alumniAPI = {
  // Get all alumni with pagination and filters
  getAll: async (page = 0, size = 12, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...filters
    });
    
    const response = await fetch(`${API_BASE_URL}/alumni?${params}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get alumni by batch (for batch directory page)
  getByBatch: async (graduationYear, branch, page = 0, size = 20) => {
    const response = await fetch(
      `${API_BASE_URL}/alumni/batch/${graduationYear}/${branch}?page=${page}&size=${size}`,
      { headers: getHeaders() }
    );
    return response.json();
  },

  // Search alumni
  search: async (query, page = 0, size = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/alumni/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
      { headers: getHeaders() }
    );
    return response.json();
  },

  // Get alumni by company
  getByCompany: async (companyName) => {
    const response = await fetch(
      `${API_BASE_URL}/alumni/company/${encodeURIComponent(companyName)}`,
      { headers: getHeaders() }
    );
    return response.json();
  },

  // Get batch statistics
  getBatchStats: async (graduationYear, branch) => {
    const response = await fetch(
      `${API_BASE_URL}/alumni/stats/batch/${graduationYear}/${branch}`,
      { headers: getHeaders() }
    );
    return response.json();
  }
};

// Batch API calls
export const batchAPI = {
  // Get all batches
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/batches`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get specific batch details
  getDetails: async (graduationYear, branch) => {
    const response = await fetch(
      `${API_BASE_URL}/batches/${graduationYear}/${branch}`,
      { headers: getHeaders() }
    );
    return response.json();
  },

  // Get batch statistics for dashboard
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/batches/stats`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get placement trends
  getTrends: async () => {
    const response = await fetch(`${API_BASE_URL}/batches/trends`, {
      headers: getHeaders()
    });
    return response.json();
  }
};

// Admin API calls
export const adminAPI = {
  // Preview NBA 2025 file
  previewNBA2025: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/validate/preview-nba2025`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Import NBA 2025 data
  importNBA2025: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/data/process-nba2025`, {
      method: 'POST',
      headers: getHeaders()
    });
    return response.json();
  },

  // Get data processing status
  getDataStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/data/status`, {
      headers: getHeaders()
    });
    return response.json();
  }
};

// Usage examples for your React components:

/*
// In your BatchesSection component:
import { batchAPI } from '../lib/api-integration';

const BatchesSection = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await batchAPI.getAll();
        setBatches(response.batches);
      } catch (error) {
        console.error('Error fetching batches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  // Rest of your component...
};

// In your Directory page:
import { alumniAPI } from '../lib/api-integration';

const DirectoryPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await alumniAPI.getAll(0, 12);
        setAlumni(response.alumni);
        setPagination({
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.currentPage
        });
      } catch (error) {
        console.error('Error fetching alumni:', error);
      }
    };

    fetchAlumni();
  }, []);

  // Rest of your component...
};

// For batch-specific directory:
const BatchDirectory = ({ graduationYear, branch }) => {
  const [batchData, setBatchData] = useState(null);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await alumniAPI.getByBatch(graduationYear, branch);
        setBatchData(response);
      } catch (error) {
        console.error('Error fetching batch data:', error);
      }
    };

    fetchBatchData();
  }, [graduationYear, branch]);

  // Display batchData.alumni array with real student information
};
*/

// Helper function to format data for display
export const formatters = {
  // Format student data for display cards
  formatAlumniCard: (alumni) => ({
    id: alumni.id,
    name: alumni.name,
    designation: alumni.designation || 'Software Engineer',
    company: alumni.currentCompany || 'Not specified',
    batch: `${alumni.admissionYear}-${alumni.graduationYear}`,
    branch: alumni.branch,
    rollNumber: alumni.rollNumber,
    email: alumni.email,
    profileImage: alumni.profileImage || '/default-avatar.png',
    isPlaced: !!alumni.currentCompany,
    location: alumni.location || alumni.workLocation,
    linkedin: alumni.linkedin,
    github: alumni.github,
    portfolio: alumni.portfolio
  }),

  // Format batch statistics
  formatBatchStats: (batch) => ({
    batchName: `${batch.branch} ${batch.admissionYear}-${batch.graduationYear}`,
    totalStudents: batch.totalStudents || 0,
    placedStudents: batch.placedStudents || 0,
    placementPercentage: Math.round((batch.placementPercentage || 0) * 100) / 100,
    averagePackage: batch.averagePackage ? `${batch.averagePackage} LPA` : 'N/A',
    topRecruiters: batch.topRecruiters || [],
    achievements: batch.achievements || []
  })
};

export default { alumniAPI, batchAPI, adminAPI, formatters };
