function normalizeMessage(message, index) {
  if (!message || typeof message !== 'object') return null

  return {
    id: message.id ?? `local-preview-message-${index}`,
    type: message.stickerImage ? 'sticker' : String(message.type || 'chat'),
    characterId: message.characterId ?? message.character_id ?? null,
    text: String(message.text ?? ''),
    imageUrl: message.imageUrl || message.image_url || '',
    audioUrl: message.audioUrl || message.audio_url || '',
    notification: message.notification || null,
  }
}

function normalizeCharacter(character) {
  if (!character || typeof character !== 'object') return null

  return {
    id: character.id,
    name: String(character.name || character.character_name || ''),
    avatar_url:
      character.avatar_url ||
      character.avatarUrl ||
      character.image_url ||
      character.imageUrl ||
      '',
    position: character.position || character.side || '',
  }
}

export function buildChatStoryPreviewDraft({
  episodeTitle = '',
  messages = [],
  characters = [],
} = {}) {
  return {
    storyType: 'chat_story',
    episodeTitle: String(episodeTitle ?? ''),
    content: '',
    pages: [],
    messages: Array.isArray(messages)
      ? messages.map(normalizeMessage).filter(Boolean)
      : [],
    characters: Array.isArray(characters)
      ? characters.map(normalizeCharacter).filter(Boolean)
      : [],
  }
}
