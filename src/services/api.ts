// Place BASE_URL and getAuthHeaders at the top
const BASE_URL = 'https://backend-edhc.onrender.com';

export const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
});

export const api = {
  // Alumni API
  alumni: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/alumni`);
      if (!res.ok) throw new Error(`Failed to fetch alumni: ${res.status}`);
      return res.json();
    },
    create: async (data: FormData, token: string) => {
      const res = await fetch(`${BASE_URL}/alumni`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      if (!res.ok) throw new Error(`Failed to create alumnus: ${res.status}`);
      return res.json();
    },
    update: async (id: string, data: FormData, token: string) => {
      const res = await fetch(`${BASE_URL}/alumni/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      if (!res.ok) throw new Error(`Failed to update alumnus: ${res.status}`);
      return res.json();
    },
    delete: async (id: string, token: string) => {
      const res = await fetch(`${BASE_URL}/alumni/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to delete alumnus: ${res.status}`);
      return res.json();
    },
  },

  // Batches API
  batches: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/batches`);
      if (!res.ok) throw new Error(`Failed to fetch batches: ${res.status}`);
      return res.json();
    },
    create: async (data: { batch_year: number; description: string }, token: string) => {
      const res = await fetch(`${BASE_URL}/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create batch: ${res.status}`);
      return res.json();
    },
    update: async (id: string, data: { batch_year: number; description: string }, token: string) => {
      const res = await fetch(`${BASE_URL}/batches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update batch: ${res.status}`);
      return res.json();
    },
    delete: async (id: string, token: string) => {
      const res = await fetch(`${BASE_URL}/batches/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to delete batch: ${res.status}`);
      return res.json();
    },
  },

  // Universities API
  universities: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/universities`);
      if (!res.ok) throw new Error(`Failed to fetch universities: ${res.status}`);
      return res.json();
    },
    create: async (data: FormData, token: string) => {
      const res = await fetch(`${BASE_URL}/universities`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      if (!res.ok) throw new Error(`Failed to create university: ${res.status}`);
      return res.json();
    },
    update: async (id: string, data: FormData, token: string) => {
      const res = await fetch(`${BASE_URL}/universities/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      if (!res.ok) throw new Error(`Failed to update university: ${res.status}`);
      return res.json();
    },
    delete: async (id: string, token: string) => {
      const res = await fetch(`${BASE_URL}/universities/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to delete university: ${res.status}`);
      return res.json();
    },
    getOfferCounts: async () => {
      const res = await fetch(`${BASE_URL}/universities/offer-counts`);
      if (!res.ok) throw new Error(`Failed to fetch offer counts: ${res.status}`);
      return res.json();
    },
  },

  // ...existing code...
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
  // Scroll API - NEW
  // Scroll API - NEW
scroll: {
  // Public - Get all scroll items
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/scroll`);
    if (!res.ok) {
      throw new Error(`Failed to fetch scrolls: ${res.status}`);
    }
    return res.json();
  },

  // Protected - Create scroll
  create: async (data: object, token: string) => {
    const res = await fetch(`${BASE_URL}/scroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create scroll: ${res.status} - ${errorText}`);
    }

    return res.json();
  },

  // Protected - Update scroll
  update: async (id: string, data: object, token: string) => {
    const res = await fetch(`${BASE_URL}/scroll/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update scroll: ${res.status} - ${errorText}`);
    }

    return res.json();
  },

  // Protected - Delete scroll
  delete: async (id: string, token: string) => {
    const res = await fetch(`${BASE_URL}/scroll/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete scroll: ${res.status} - ${errorText}`);
    }

    return res.json().catch(() => ({})); // fallback if server sends empty response
  },
},
// Achievements API - NEW
achievements: {
  // Public - Get all achievements
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/achievements`);
    if (!res.ok) {
      throw new Error(`Failed to fetch achievements: ${res.status}`);
    }
    return res.json();
  },

  // Protected - Create achievement
  create: async (data: object, token: string) => {
    const res = await fetch(`${BASE_URL}/achievements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create achievement: ${res.status} - ${errorText}`);
    }

    return res.json();
  },

  // Protected - Update achievement
  update: async (id: string, data: object, token: string) => {
    const res = await fetch(`${BASE_URL}/achievements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update achievement: ${res.status} - ${errorText}`);
    }

    return res.json();
  },

  // Protected - Delete achievement
  delete: async (id: string, token: string) => {
    const res = await fetch(`${BASE_URL}/achievements/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete achievement: ${res.status} - ${errorText}`);
    }

    return res.json().catch(() => ({})); // fallback if server sends empty response
  },
},

  // Bus Routes API
  busRoutes: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/bus-routes`);
      if (!res.ok) throw new Error(`Failed to fetch bus routes: ${res.status}`);
      return res.json();
    },
    getById: async (id: string | number) => {
      const res = await fetch(`${BASE_URL}/bus-routes/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch bus route: ${res.status}`);
      return res.json();
    },
    create: async (data: { route_name: string; bus_number: string; active?: boolean }, token: string) => {
      const res = await fetch(`${BASE_URL}/bus-routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create bus route: ${res.status}`);
      return res.json();
    },
    update: async (id: string | number, data: { route_name?: string; bus_number?: string; active?: boolean }, token: string) => {
      const res = await fetch(`${BASE_URL}/bus-routes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update bus route: ${res.status}`);
      return res.json();
    },
    delete: async (id: string | number, token: string) => {
      const res = await fetch(`${BASE_URL}/bus-routes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to delete bus route: ${res.status}`);
      return res.json();
    },
  },

  // Bus Stops API
  busStops: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/bus-stops`);
      if (!res.ok) throw new Error(`Failed to fetch bus stops: ${res.status}`);
      return res.json();
    },
    getByRoute: async (routeId: string | number) => {
      const res = await fetch(`${BASE_URL}/bus-stops/route/${routeId}`);
      if (!res.ok) throw new Error(`Failed to fetch bus stops for route: ${res.status}`);
      return res.json();
    },
    create: async (data: { name: string; pickup?: string; drop?: string; order?: number; route: string | number }, token: string) => {
      const res = await fetch(`${BASE_URL}/bus-stops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create bus stop: ${res.status}`);
      return res.json();
    },
    update: async (id: string | number, data: { name?: string; pickup?: string; drop?: string; order?: number; route?: string | number }, token: string) => {
      const res = await fetch(`${BASE_URL}/bus-stops/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update bus stop: ${res.status}`);
      return res.json();
    },
    delete: async (id: string | number, token: string) => {
      const res = await fetch(`${BASE_URL}/bus-stops/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to delete bus stop: ${res.status}`);
      return res.json();
    },
  },
};