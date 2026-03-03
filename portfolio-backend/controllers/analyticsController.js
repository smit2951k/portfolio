const supabase = require('../config/supabase');

// Middleware used globally in server.js to track every visit to non-API paths
exports.trackVisit = async (req, res, next) => {
    try {
        // Skip tracking for API requests (to avoid noisy analytics)
        if (req.originalUrl.startsWith('/api')) {
            return next();
        }

        let ip = req.ip || req.connection.remoteAddress;
        if (ip === '::1') ip = '127.0.0.1'; // Map IPv6 localhost to IPv4

        const parts = ip.split('.');
        if (parts.length === 4) {
            parts[3] = '0';
            ip = parts.join('.');
        }

        const { error } = await supabase.from('visits').insert([{
            page: req.originalUrl,
            userAgent: req.headers['user-agent'] || 'Unknown',
            ip: ip
        }]);

        if (error) {
            console.error('Supabase Error tracking visit:', error.message);
        }

        next();
    } catch (error) {
        console.error('Error tracking visitor:', error.message);
        next();
    }
};

exports.trackVisitApi = async (req, res, next) => {
    try {
        let ip = req.ip || req.connection.remoteAddress;
        if (ip === '::1') ip = '127.0.0.1';

        const parts = ip.split('.');
        if (parts.length === 4) {
            parts[3] = '0';
            ip = parts.join('.');
        }

        const visitUrl = req.body && req.body.page ? req.body.page : req.headers.referer || '/';

        const { error } = await supabase.from('visits').insert([{
            page: visitUrl,
            userAgent: req.headers['user-agent'] || 'Unknown',
            ip: ip
        }]);

        if (error) {
            console.error('Supabase Error tracking visit API:', error.message);
            return res.status(500).json({ success: false });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error tracking visitor api:', error.message);
        res.status(500).json({ success: false });
    }
};

exports.getAnalytics = async (req, res, next) => {
    try {
        const { count: totalVisits, error: cErr } = await supabase
            .from('visits')
            .select('*', { count: 'exact', head: true });

        if (cErr) throw new Error(cErr.message);

        // Supabase doesn't support grouping in the JS client without an RPC, 
        // so we'll fetch them (or limit if large) to group in-memory.
        // For a portfolio, this is usually acceptable, though an RPC `get_page_visits` is better.
        const { data: allVisits, error: aErr } = await supabase
            .from('visits')
            .select('page');

        if (aErr) throw new Error(aErr.message);

        const visitsMap = {};
        allVisits.forEach(v => {
            visitsMap[v.page] = (visitsMap[v.page] || 0) + 1;
        });

        const visitsPerPage = Object.keys(visitsMap).map(k => ({
            _id: k,
            count: visitsMap[k]
        })).sort((a, b) => b.count - a.count);

        const { data: recentVisits, error: rErr } = await supabase
            .from('visits')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (rErr) throw new Error(rErr.message);

        res.status(200).json({
            success: true,
            data: {
                totalVisits,
                visitsPerPage,
                recentVisits
            }
        });
    } catch (error) {
        next(error);
    }
};
