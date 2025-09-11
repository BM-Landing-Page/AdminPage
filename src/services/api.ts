const BASE_URL = 'https://backend-edhc.onrender.com';

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

  // Career API
  career: {
    getAll: (token: string) =>
      fetch(`${BASE_URL}/career`, {
        headers: getAuthHeaders(token),
      }).then(res => res.json()),

    create: (data: any) =>
      fetch(`${BASE_URL}/career`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any, token: string) =>
      fetch(`${BASE_URL}/career/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),

    delete: (id: string, token: string) =>
      fetch(`${BASE_URL}/career/${id}`, {
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
        body: JSON.stringify({ description: achievementText }),
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

  // Feedback API
  feedback: {
    // Public - Get all feedback
    getAll: () => fetch(`${BASE_URL}/feedback`).then(res => res.json()),

    // Public - Send feedback via email (no database storage)
    sendEmail: (data: {
      parent_name: string;
      student_name: string;
      grade: number;
      desc: string;
    }) =>
      fetch(`${BASE_URL}/feedback/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),

    // Protected - Create feedback in database
    create: (data: {
      parent_name: string;
      student_name: string;
      grade: number;
      desc: string;
    }, token: string) =>
      fetch(`${BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),

    // Protected - Update feedback
    update: (id: string, data: {
      parent_name: string;
      student_name: string;
      grade: number;
      desc: string;
    }, token: string) =>
      fetch(`${BASE_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),

    // Protected - Delete feedback
    delete: (id: string, token: string) =>
      fetch(`${BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }),
  },

  // Popup API - NEW
  // api.ts

popup: {
  // Public - Get current popup
  get: async () => {
    const res = await fetch(`${BASE_URL}/popup`);
    if (!res.ok) throw new Error(`Failed to fetch popup: ${res.status}`);
    return res.json();
  },

  // Protected - Create popup (replaces existing)
  create: async (data: FormData, token: string) => {
    const res = await fetch(`${BASE_URL}/popup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // 👈 don't set Content-Type manually for FormData
      },
      body: data,
    });

    if (!res.ok) {
      const errorText = await res.text(); // Try to read backend error
      throw new Error(`Failed to create popup: ${res.status} - ${errorText}`);
    }

    return res.json();
  },

  // Protected - Update popup
  update: async (data: FormData, token: string) => {
    const res = await fetch(`${BASE_URL}/popup`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update popup: ${res.status} - ${errorText}`);
    }

    return res.json();
  },

  // Protected - Delete popup
  delete: async (token: string) => {
    const res = await fetch(`${BASE_URL}/popup`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete popup: ${res.status} - ${errorText}`);
    }

    return res.json().catch(() => ({})); // if server returns empty response
  },
},
};