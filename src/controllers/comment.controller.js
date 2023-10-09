'use strict'

const CommentService = require("../services/comment.service")
const { SuccessResponse } = require('../core/success.response')
const {
    createComment
} = require('../services/comment.service')

class CommentController {
    createComment = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Create new comment success',
            metadata: await createComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()