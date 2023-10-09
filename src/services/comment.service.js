'use strict'

const { Types } = require('mongoose')
const commentModel = require('../models/comment.model')

const {
    BadRequestError, 
    ConflictRequestError, 
    AuthFailureError,
    ForbiddenError
} = require('../core/error.response')

/*
    Key feature
    + add comment (User, Shop)
    + get list of comment (User, Shop)
    + delete comment ( User, Shop, Admin)
    + 
 */
class CommentService {
    static async createComment ({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue
        if (parentCommentId) {
            // reply Comment

            const parentComment = await commentModel.findById(parentCommentId)
            if (! parentComment) throw new BadRequestError('Error: Comment not found')

            rightValue = parentComment.comment_right
            // update Many comment
            await commentModel.updateMany({
                comment_productId: new Types.ObjectId(productId),
                comment_right: { $gte: rightValue}
            }, {
                $inc: { comment_right: 2}
            })

            await commentModel.updateMany({
                comment_productId: new Types.ObjectId(productId),
                comment_left: { $gt: rightValue}
            }, {
                $inc: { comment_left: 2}
            })
        } else {
            // maximum right
            const maximumRightValue = await commentModel.findOne({ 
                comment_productId: new Types.ObjectId(productId)
            }, 'comment_right', {sort: {comment_right: -1}})
            if (maximumRightValue) {
                rightValue = maximumRightValue + 1
            } else {
                rightValue = 1
            }
        }

        // insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        await comment.save()

        return comment
    }
}

module.exports = CommentService