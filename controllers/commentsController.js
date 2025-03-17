import CommentModel from "../models/commentModel.js";

const createComment = async (req, res) => {
    const { content, project_id, task_id } = req.body;
    if (!content) {
        return res.status(400).json({ message: "Content required" });
    }

    try {
        await CommentModel.createComment({ content, project_id, task_id });
        res.status(201).json({ message: "Commet created" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const getAllComments = async (req, res) => {
    let id = req.params.id;
    let limit = req.query.limit;
    let page = req.query.page;
    try {
    let result = await CommentModel.getComments({ id, page, limit });
    if (id && result == null) {
        return res.status(404).json({ message: "Id not found" });
    }
    res.json(result);
   
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const deleteComment = async (req, res) => {
    let id = req.params.id;
    try {
        let result = await CommentModel.deleteComment(id);
        if (result.length === 0) {
            return res.status(404).json({ message: "Id not found" });
        }
        res.status(200).json({ message: "comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export { createComment, getAllComments, deleteComment };
