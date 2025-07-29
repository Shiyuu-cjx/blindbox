const { Comment } = require('../models');

exports.createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { showId } = req.params;
        const userId = req.userData.userId;

        const newComment = await Comment.create({
            content,
            ShowId: showId,
            UserId: userId,
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: '评论失败', error: error.message });
    }
};
