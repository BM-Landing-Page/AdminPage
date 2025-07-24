const BASE_URL = 'http://localhost:5000';

export const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
});

export const api = {
  // Blog API
  blog: {
    getAll: () => fetch(`${BASE_URL}/blog`).then(res => res.json()),
    create: (data: FormData, token: string) =>
      fetch(`${BASE_URL}/blog`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: data,
      }),
    update: (id: string, data: FormData, token: string) =>
      fetch(`${BASE_URL}/blog/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: data,
      }),
    delete: (id: string, token: string) =>
      fetch(`${BASE_URL}/blog/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }),
  },

  // Team API
  team: {
    getAll: () => fetch(`${BASE_URL}/team`).then(res => res.json()),
    create: (data: FormData, token: string) =>
      fetch(`${BASE_URL}/team`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: data,
      }).then(res => res.json()),
    update: (id: string, data: FormData, token: string) =>
      fetch(`${BASE_URL}/team/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: data,
      }).then(res => res.json()),
    delete: (id: string, token: string) =>
      fetch(`${BASE_URL}/team/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }),
    addAchievement: (memberId: string, achievementText: string, token: string) =>
      fetch(`${BASE_URL}/team/${memberId}/achievements`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: achievementText }), // Changed from achievement_text
      }),
    deleteAchievement: (achievementId: string, token: string) =>
      fetch(`${BASE_URL}/team/achievements/${achievementId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }),
  },

  // Applications API
  applications: {
    getAll: (token: string) =>
      fetch(`${BASE_URL}/applications`, {
        headers: getAuthHeaders(token),
      }).then(res => res.json()),
    create: (data: any) =>
      fetch(`${BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any, token: string) =>
      fetch(`${BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    delete: (id: string, token: string) =>
      fetch(`${BASE_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }),
  },

  // Calendar API
  calendar: {
    getAll: () => fetch(`${BASE_URL}/calendar`).then(res => res.json()),
    create: (data: any, token: string) =>
      fetch(`${BASE_URL}/calendar`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any, token: string) =>
      fetch(`${BASE_URL}/calendar/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    delete: (id: string, token: string) =>
      fetch(`${BASE_URL}/calendar/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }),
  },

  // Gallery API
  gallery: {
    getAll: () => fetch(`${BASE_URL}/data`).then(res => res.json()),
    create: (data: FormData, token: string) =>
      fetch(`${BASE_URL}/data`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: data,
      }),
    update: (id: string, data: any, token: string) =>
      fetch(`${BASE_URL}/data/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    delete: (id: string, token: string) =>
      fetch(`${BASE_URL}/data/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }),
  },
};