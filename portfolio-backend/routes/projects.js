const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

const { protect } = require('../middleware/auth');

// Basic validation rules for projects
const projectValidation = [
    body('title').trim().notEmpty().escape().withMessage('Title is required'),
    body('description').trim().notEmpty().escape().withMessage('Description is required'),
    body('tags').isArray().withMessage('Tags must be an array'),
    body('category').trim().notEmpty().escape().withMessage('Category is required')
];

// Combine routes based on endpoints
router.route('/')
    .get(getProjects)
    .post(protect, projectValidation, createProject);

router.route('/:id')
    .get(getProject)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

module.exports = router;
