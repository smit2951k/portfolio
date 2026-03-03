const supabase = require('../config/supabase');
const { validationResult } = require('express-validator');

exports.getProjects = async (req, res, next) => {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        next(error);
    }
};

exports.getProject = async (req, res, next) => {
    try {
        const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

exports.createProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { data: project, error } = await supabase
            .from('projects')
            .insert([req.body])
            .select()
            .single();

        if (error) throw new Error(error.message);

        res.status(201).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const { data: project, error } = await supabase
            .from('projects')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const { data: project, error } = await supabase
            .from('projects')
            .delete()
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
