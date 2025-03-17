import ProjectModel from "../models/projectModel.js";

// Create a new project
const createProject = async (req, res) => {
    try {
        const { name, color, is_favorite } = req.body;
        if (!name || !color) {
            return res.status(400).json({ message: "Provide inputs" });
        }

        await ProjectModel.createProject({ name, color, is_favorite });

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

        if (!name || !color || is_favorite == null) {
            return res.status(400).json({ message: "Provide inputs" });
        }

        const updated = await ProjectModel.updateProject(id, {
            name,
            color,
            is_favorite,
        });

        if (!updated) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project updated successfully" });
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
