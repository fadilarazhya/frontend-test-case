export type {
    FetchPostsResult,
    FetchPostResult,
    FetchCommentsResult,
} from './post-remote'

export {
    fetchAllPosts,
    fetchPostById,
    fetchCommentsByPostId,
    searchPostById,
    fetchPostWithComments,
} from './post-remote'