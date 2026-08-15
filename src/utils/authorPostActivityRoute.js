function cleanValue(value) {
  return String(value ?? '').trim()
}

function normalizeActivityType(notification, metadata) {
  const notificationType = cleanValue(
    metadata.notification_type ||
      notification?.type
  ).toLowerCase()

  const reactionType = cleanValue(
    metadata.reaction_type
  ).toLowerCase()

  const commentId = cleanValue(
    metadata.comment_id ||
      metadata.commentId
  )

  const parentId = cleanValue(
    metadata.parent_id ||
      metadata.parentId
  )

  if (
    reactionType === 'comment_like' &&
    commentId
  ) {
    return 'comment_like'
  }

  if (
    notificationType === 'comment' ||
    notificationType === 'comments'
  ) {
    return parentId ? 'reply' : 'comment'
  }

  if (
    notificationType === 'mention' ||
    notificationType === 'mentions'
  ) {
    return 'mention'
  }

  if (notificationType === 'echo') {
    return 'echo'
  }

  if (notificationType === 'reaction') {
    return commentId
      ? 'comment_like'
      : 'reaction'
  }

  if (
    notificationType === 'post' ||
    notificationType === 'posts'
  ) {
    return 'post'
  }

  if (commentId) {
    return parentId ? 'reply' : 'comment'
  }

  return 'post'
}

export function buildAuthorPostActivityRoute({
  postId,
  type = 'post',
  commentId = '',
  echoId = '',
} = {}) {
  const safePostId = cleanValue(postId)

  if (!safePostId) return ''

  const params = new URLSearchParams()
  const safeType =
    cleanValue(type).toLowerCase() || 'post'
  const safeCommentId = cleanValue(commentId)
  const safeEchoId = cleanValue(echoId)

  params.set('type', safeType)

  if (safeCommentId) {
    params.set('commentId', safeCommentId)
  }

  if (safeEchoId) {
    params.set('echoId', safeEchoId)
  }

  return `/author/page/posts/${encodeURIComponent(
    safePostId
  )}/activity?${params.toString()}`
}

export function resolveAuthorPostActivityRoute(
  notification
) {
  const metadata =
    notification?.metadata &&
    typeof notification.metadata === 'object'
      ? notification.metadata
      : {}

  const postId = cleanValue(
    metadata.post_id ||
      metadata.postId ||
      notification?.post_id ||
      notification?.postId
  )

  if (!postId) return ''

  const commentId = cleanValue(
    metadata.comment_id ||
      metadata.commentId ||
      notification?.comment_id ||
      notification?.commentId
  )

  const echoId = cleanValue(
    metadata.echo_id ||
      metadata.echoId ||
      notification?.echo_id ||
      notification?.echoId
  )

  return buildAuthorPostActivityRoute({
    postId,
    type: normalizeActivityType(
      notification,
      metadata
    ),
    commentId,
    echoId,
  })
}
