const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Create basic headers
const createHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  return headers
}

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = false
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = createHeaders()
  
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Automatically attach HttpOnly cookies
    headers: {
      ...headers,
      ...options.headers,
    },
  }
  
  const response = await fetch(url, config)
  
  if (!response.ok) {
    // Try parsing JSON error body, fall back to status message
    let errorMsg = `HTTP error! status: ${response.status}`
    try {
      const errorData = await response.json()
      errorMsg = errorData.message || errorMsg
    } catch {
      // non-JSON error body (e.g. 401 empty body from gateway)
      const text = await response.text().catch(() => '')
      if (text) errorMsg = text
    }
    throw new Error(errorMsg)
  }
  
  // Safely parse JSON — some endpoints return empty body on success
  const text = await response.text()
  try {
    return (text ? JSON.parse(text) : {}) as unknown as T
  } catch {
    return {} as unknown as T
  }
}

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  register: (userData: any) =>
    apiRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
  refreshToken: (refreshToken: string) =>
    apiRequest('/api/auth/refresh', {
      method: 'POST',
    }),
    
  logout: () =>
    apiRequest('/api/v1/auth/logout', {
      method: 'POST',
    }),
    
  validateToken: () =>
    apiRequest('/api/auth/validate', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
    
  getCurrentUser: () =>
    apiRequest('/api/auth/me', {
      method: 'GET',
    }, true),
    
  getLinkedInAuthUrl: (role?: string) =>
    apiRequest<{ authUrl: string }>(`/api/v1/auth/linkedin/auth-url${role ? `?role=${role}` : ''}`, {
      method: 'GET',
    }),

  linkedInCallback: (code: string, role?: string) =>
    apiRequest('/api/v1/auth/linkedin/callback', {
      method: 'POST',
      body: JSON.stringify({ code, role }),
    }),
}

// User API calls
export const userAPI = {
  getProfile: (userId: string) =>
    apiRequest(`/api/v1/profiles/${userId}`, {
      method: 'GET',
    }, true),
    
  getPublicProfile: (userId: string) =>
    apiRequest(`/api/v1/profiles/public/${userId}`, {
      method: 'GET',
    }, false),
    
  createOrUpdateProfile: (userId: string, profileData: any) =>
    apiRequest(`/api/v1/profiles/${userId}`, {
      method: 'POST',
      body: JSON.stringify(profileData),
    }, true),
    
  updateMyProfile: (profileData: any) =>
    apiRequest('/api/v1/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }, true),
    
  getMyProfile: () =>
    apiRequest('/api/v1/profiles/me', {
      method: 'GET',
    }, true),
    
  getDirectory: () => {
    return apiRequest(`/api/v1/profiles`, {
      method: 'GET',
    }, true)
  },
  
  getFilters: () =>
    apiRequest('/api/users/filters', {
      method: 'GET',
    }, true),
    
  getStats: () =>
    apiRequest('/api/users/stats', {
      method: 'GET',
    }, true),
    
  getUserById: (id: string) =>
    apiRequest(`/api/users/${id}`, {
      method: 'GET',
    }, true),
    
  updateProfile: (profileData: any) =>
    apiRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }, true),
}

// Profile Image API calls
export const profileImageAPI = {
  uploadImage: (userId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const headers: HeadersInit = {}
    
    return fetch(`${API_BASE_URL}/api/v1/profiles/${userId}/image`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
  },
  
  getImageUrl: (userId: string) =>
    apiRequest(`/api/profile-images/user/${userId}`, {
      method: 'GET',
    }, true),
}

// Global Storage API
export const storageAPI = {
  uploadFile: (file: File, folder: string = 'general') => {
    const formData = new FormData()
    formData.append('file', file)
    
    const headers: HeadersInit = {}
    
    return fetch(`${API_BASE_URL}/api/v1/profiles/storage/upload?folder=${folder}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    }).then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.error || 'Upload failed') })
      }
      return res.json()
    })
  }
}

// Job API calls
export const jobAPI = {
  getJobs: () => {
    return apiRequest(`/api/v1/jobs`, {
      method: 'GET',
    }, true)
  },
  
  createJob: (jobData: any) =>
    apiRequest('/api/v1/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }, true),
    
  updateJob: (id: string | number, jobData: any) =>
    apiRequest(`/api/v1/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    }, true),
    
  deleteJob: (id: string | number) =>
    apiRequest(`/api/v1/jobs/${id}`, {
      method: 'DELETE',
    }, true),
}

// Post Service API calls
export const postAPI = {
  getFeed: () => {
    return apiRequest('/api/v1/posts', {
      method: 'GET',
    }, true)
  },
  
  createPost: (postData: any) => {
    return apiRequest('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }, true)
  },
  
  getUserPosts: (authorId: string) => {
    return apiRequest(`/api/v1/posts/user/${authorId}`, {
      method: 'GET',
    }, true)
  },
  
  deletePost: (id: string | number) => {
    return apiRequest(`/api/v1/posts/${id}`, {
      method: 'DELETE',
    }, true)
  },
  
  toggleLike: (id: string | number) => {
    return apiRequest<{ liked: boolean }>(`/api/v1/posts/${id}/like`, {
      method: 'POST',
    }, true)
  },
  
  getComments: (id: string | number) => {
    return apiRequest(`/api/v1/posts/${id}/comments`, {
      method: 'GET',
    }, true)
  },
  
  addComment: (id: string | number, content: string) => {
    return apiRequest(`/api/v1/posts/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }, true)
  }
}

// Mentorship Service API calls
export const mentorshipAPI = {
  createRequest: (requestData: any) => {
    return apiRequest('/api/v1/mentorships/request', {
      method: 'POST',
      body: JSON.stringify(requestData),
    }, true)
  },
  
  getRequestsByStudent: (studentId: string) => {
    return apiRequest(`/api/v1/mentorships/student/${studentId}`, {
      method: 'GET',
    }, true)
  },

  getRequestsByAlumni: (alumniId: string) => {
    return apiRequest(`/api/v1/mentorships/alumni/${alumniId}`, {
      method: 'GET',
    }, true)
  },

  updateRequestStatus: (requestId: string, status: string) => {
    return apiRequest(`/api/v1/mentorships/${requestId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }, true)
  }
}

// Stats Service API calls
export const statsAPI = {
  getBatches: () => {
    return apiRequest('/api/v1/stats/batches', {
      method: 'GET',
    }, false) // Public route
  },
  getSpotlights: () => {
    return apiRequest('/api/v1/stats/spotlights', {
      method: 'GET',
    }, false) // Public route
  },
  getDashboardSummary: () => {
    return apiRequest('/api/v1/stats/dashboard/summary', {
      method: 'GET',
    }, true)
  }
}

// Events Service API calls
export const eventsAPI = {
  getEvents: () => {
    return apiRequest('/api/v1/events', {
      method: 'GET',
    }, true)
  },
  createEvent: (eventData: any) => {
    return apiRequest('/api/v1/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }, true)
  },
  updateEvent: (eventId: number | string, eventData: any) => {
    return apiRequest(`/api/v1/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }, true)
  },
  registerForEvent: (eventId: number | string) => {
    return apiRequest(`/api/v1/events/${eventId}/register`, {
      method: 'PUT'
    }, true)
  },
  deleteEvent: (eventId: number | string) => {
    return apiRequest(`/api/v1/events/${eventId}`, {
      method: 'DELETE'
    }, true)
  }
}

// Messaging API calls
export const messageAPI = {
  sendMessage: (senderId: string, receiverId: string, content: string, fileUrl?: string, fileName?: string, fileType?: string) =>
    apiRequest<any>('/api/v1/profiles/messages/send', {
      method: 'POST',
      body: JSON.stringify({ senderId, receiverId, content, fileUrl, fileName, fileType }),
    }, true),
    
  getConversation: (user1: string, user2: string) =>
    apiRequest<any[]>(`/api/v1/profiles/messages/conversation/${user1}/${user2}`, {
      method: 'GET',
    }, true),
    
  getConversations: (userId: string) =>
    apiRequest<any[]>(`/api/v1/profiles/messages/conversations/${userId}`, {
      method: 'GET',
    }, true),
    
  markAsRead: (senderId: string, receiverId: string) =>
    apiRequest<void>(`/api/v1/profiles/messages/read/${senderId}/${receiverId}`, {
      method: 'PUT',
    }, true),

  getUnreadCount: (userId: string) =>
    apiRequest<any>(`/api/v1/profiles/messages/unread/${userId}`, {
      method: 'GET',
    }, true),
}

// Admin Operations API
export const adminAPI = {
  getPendingVerifications: () =>
    apiRequest<any[]>('/api/v1/profiles/admin/users/pending', { method: 'GET' }, true),

  getStudents: () =>
    apiRequest<any[]>('/api/v1/profiles/admin/users/students', { method: 'GET' }, true),

  getAlumni: () =>
    apiRequest<any[]>('/api/v1/profiles/admin/users/alumni', { method: 'GET' }, true),

  verifyUser: async (userId: string) => {
    await Promise.all([
      apiRequest(`/api/v1/auth/admin/users/${userId}/verify`, { method: 'PUT' }, true),
      apiRequest(`/api/v1/profiles/admin/users/${userId}/verify`, { method: 'PUT' }, true)
    ]);
  },

  deleteUser: (userId: string) =>
    apiRequest<void>(`/api/v1/profiles/admin/users/${userId}`, { method: 'DELETE' }, true),
}

export default {
  authAPI,
  userAPI,
  profileImageAPI,
  jobAPI,
  postAPI,
  mentorshipAPI,
  statsAPI,
  eventsAPI,
  messageAPI,
  adminAPI,
}
