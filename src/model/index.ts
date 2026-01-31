export type { Post, PostState } from './post-model'
export type { Comment, CommentState } from './comment-model'
export type { Todo, TodoState } from './todo-model'

export {
    createInitialPostState,
    isValidPost,
    isValidPostArray,
    createEmptyPost,
    getPostPreview,
    filterPostsByUserId,
    findPostById,
    sortPostsById,
    searchPostsByTitle,
    searchPostsById,
} from './post-model'

export {
    createInitialCommentState,
    isValidComment,
    isValidCommentArray,
    createEmptyComment,
    filterCommentsByPostId,
    findCommentById,
    sortCommentsById,
    getCommentCount,
    getCommentPreview,
    searchCommentsByEmail,
    getUniqueEmailsFromComments,
} from './comment-model'

export {
    createInitialTodoState,
    generateTodoId,
    createTodo,
    isValidTodo,
    isValidTodoArray,
    toggleTodoCompleted,
    updateTodoTitle,
    filterTodos,
    findTodoById,
    removeTodoById,
    sortTodosByCreatedAt,
    sortTodosByCompleted,
    getCompletedCount,
    getPendingCount,
    getTodoStats,
    searchTodosByTitle,
    isTodoTitleValid,
    isDuplicateTodoTitle,
} from './todo-model'