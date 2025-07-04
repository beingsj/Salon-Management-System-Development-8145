// Mock Supabase client for standalone operation
const mockSupabase = {
  from: (table) => ({
    select: (columns = '*') => Promise.resolve({ data: [], error: null }),
    insert: (data) => Promise.resolve({ data: Array.isArray(data) ? data : [data], error: null }),
    update: (data) => Promise.resolve({ data: Array.isArray(data) ? data : [data], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    upsert: (data) => Promise.resolve({ data: Array.isArray(data) ? data : [data], error: null }),
    eq: function(column, value) {
      return this;
    },
    gte: function(column, value) {
      return this;
    },
    lte: function(column, value) {
      return this;
    },
    order: function(column, options) {
      return this;
    },
    limit: function(count) {
      return this;
    }
  }),
  auth: {
    signUp: (credentials) => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signInWithPassword: (credentials) => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: (callback) => {
      // Mock auth state change listener
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  channel: (name) => ({
    on: function(event, filter, callback) {
      return this;
    },
    subscribe: () => Promise.resolve({ status: 'SUBSCRIBED' })
  })
};

export default mockSupabase;