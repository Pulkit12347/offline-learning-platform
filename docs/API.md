API DESIGN

Overview

The frontend and backend communicate exclusively through REST APIs.

The frontend should never access the database directly.

All business logic, authentication, learning-gap detection, and data validation should be handled by the backend.

Responses should be returned in JSON format.

⸻

Authentication

POST /auth/register

Creates a new user account.

Request

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "grade": "10"
}

Response

{
  "message": "User registered successfully"
}

⸻

POST /auth/login

Authenticates a user.

Request

{
  "email": "john@example.com",
  "password": "password123"
}

Response

Returns JWT access token.

{
  "access_token": "...",
  "token_type": "bearer"
}

⸻

GET /auth/me

Returns information about the currently authenticated user.

⸻

Topics

GET /topics

Returns all available topics.

⸻

GET /topics/{id}

Returns a single topic and its information.

⸻

Lessons

GET /lessons

Returns every lesson.

Supports future filtering by topic.

⸻

GET /lessons/{id}

Returns one lesson.

Includes:

* title
* content
* topic
* estimated reading time

⸻

GET /topics/{id}/lessons

Returns every lesson belonging to a topic.

⸻

Lesson Progress

GET /user/lessons

Returns lesson progress for the current user.

⸻

PATCH /user/lessons/{lessonId}

Updates lesson progress.

Possible status values:

* NOT_STARTED
* IN_PROGRESS
* COMPLETED

⸻

Questions

GET /topics/{id}/questions

Returns quiz questions for a topic.

Initially returns multiple-choice questions.

Future versions may support filtering by difficulty.

⸻

Quiz Attempts

POST /attempts

Stores a quiz attempt.

Request

{
  "question_id": 12,
  "selected_option": "B"
}

Response

{
  "correct": true,
  "correct_option": "B"
}

⸻

GET /attempts/history

Returns quiz history for the authenticated user.

⸻

Progress

GET /progress

Returns dashboard statistics.

Example response:

{
  "overall_progress": 65,
  "completed_lessons": 18,
  "topics_mastered": 5,
  "weak_topics": [
    "Factoring",
    "Quadratic Equations"
  ]
}

⸻

Learning Gap Detection

GET /recommendations

Returns personalized recommendations.

Example:

{
  "recommended_topic": "Factoring",
  "reason": "Low mastery detected in prerequisite topic."
}

Future versions may return multiple recommendations ranked by priority.

⸻

Dashboard

GET /dashboard

Returns all information required for the student dashboard in a single request.

Example sections:

* user information
* progress summary
* weak topics
* recommended topic
* recent activity
* completed lessons

⸻

Offline Synchronization

These endpoints will be introduced after the MVP.

POST /sync

Uploads locally stored quiz attempts and lesson progress.

Returns updated server state.

⸻

GET /sync/content

Downloads updated lessons and quizzes for offline storage.

⸻

AI Assistance

These endpoints will be introduced after the MVP.

POST /ai/explain

Returns a simplified explanation of a concept.

⸻

POST /ai/hint

Returns a hint without revealing the full answer.

⸻

POST /ai/summarize

Returns a concise summary of a lesson.

⸻

Response Format

Successful responses should follow a consistent structure.

Example:

{
  "success": true,
  "data": {}
}

Errors should also follow a consistent structure.

Example:

{
  "success": false,
  "message": "Invalid credentials."
}

⸻

Authentication

Protected endpoints require a valid JWT token.

Authentication should be performed using the Authorization header.

Authorization: Bearer <token>

⸻

Versioning

Current API version:

v1

Future versions should be introduced without breaking existing clients.

Example:

/api/v1/topics

⸻

API Design Principles

* RESTful endpoint naming
* Consistent response format
* Proper HTTP status codes
* Backend handles all business logic
* Frontend remains presentation-focused
* Validation occurs on the server
* Authentication required for all user-specific endpoints
* Keep endpoints modular and easy to extend