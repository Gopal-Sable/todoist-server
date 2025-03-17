import ProjectModel from "../models/projectModel.js";

// Create a new project
const createProject = async (req, res) => {
    try {
        const { name, color, is_favorite } = req.body;
        if (!name || !color) {
            return res.status(400).json({ message: "Provide inputs" });
        }

        await ProjectModel.createProject({
            name,
            color,
            is_favorite,
            // id: req.user.id,
        });

        res.status(201).json({ message: "Project created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get all projects or a specific project by ID
const getProjects = async (req, res) => {
    try {
        const id = req.params.id ? parseInt(req.params.id, 10) : null;

        if (id && isNaN(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        const projects = await ProjectModel.getProjects({
            // user_id: req.user.id,
            id,
            page: Number.isInteger(page) && page > 0 ? page : 1,
            limit: Number.isInteger(limit) && limit > 0 ? limit : 100,
        });

        if (id && !projects) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update project by ID
const updateProject = async (req, res) => {
    try {
        const { name, color, is_favorite } = req.body;
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        // Build the update object dynamically
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (color !== undefined) updateFields.color = color;
        if (is_favorite !== undefined) updateFields.is_favorite = is_favorite;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "Provide at least one field to update" });
        }

        const updated = await ProjectModel.updateProject(id, updateFields);

        if (!updated) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project updated successfully", updatedFields: updateFields });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


// Delete all projects or a project by ID
const deleteProject = async (req, res) => {
    try {
        const id = req.params.id ? Number(req.params.id) : null;

        if (id && isNaN(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        const deleted = await ProjectModel.deleteProject(id);

        if (!deleted) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export { createProject, getProjects, updateProject, deleteProject };
