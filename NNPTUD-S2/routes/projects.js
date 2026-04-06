const express = require('express');
const router = express.Router();
const Project = require('../schemas/project');


router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('owner', 'username email');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const newProject = new Project({
            name: req.body.name,
            description: req.body.description,
            owner: req.body.owner 
        });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa dự án thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/:projectId/add-member', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userId } = req.body; 
        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json({ message: "Không thấy dự án" });
        if (!project.members.includes(userId)) {
            project.members.push(userId);
            await project.save();
        }
        res.status(200).json({ message: "Thêm thành viên thành công!", project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;