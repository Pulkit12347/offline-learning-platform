const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function requestJson(path, errorMessage) {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(errorMessage)
  }

  return response.json()
}

export async function fetchTopics() {
  return requestJson('/api/v1/topics', 'Failed to load topics')
}

export async function fetchTopic(topicId) {
  return requestJson(`/api/v1/topics/${topicId}`, 'Failed to load topic')
}
