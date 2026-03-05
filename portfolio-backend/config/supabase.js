const { createClient } = require('@supabase/supabase-js');

let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
} else {
    // Dummy client to prevent DNS timeouts when vars are missing
    supabase = {
        from: () => ({
            insert: () => ({ select: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }) }),
            select: () => ({ order: () => ({ limit: async () => ({ data: [], error: null }) }) })
        })
    };
}

module.exports = supabase;
