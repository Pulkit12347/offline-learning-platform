DATABASE DESIGN

Overview

The database is responsible for storing all persistent application data.

The design follows the principles of:

* Normalization
* Minimal redundancy
* Scalability
* Clear relationships
* Easy future expansion

The database should support both the MVP and future features such as offline synchronization, AI recommendations, analytics, and teacher dashboards without major schema redesign.

⸻

Entity Relationship Overview

The platform consists of seven primary entities.

User
 ├── Attempts
 └── UserLessons
Topic
 ├── Lessons
 ├── Questions
 └── Prerequisites
Lesson
 ├── belongs to Topic
 └── UserLessons
Question
 └── belongs to Topic
Attempt
 ├── belongs to User
 └── belongs to Question

⸻

Users

Represents every student using the platform.

Purpose:

* Authentication
* Progress tracking
* Quiz history
* Personalization

Fields

* id
* name
* email
* password_hash
* grade
* created_at

Relationships

* One user can have many attempts.
* One user can have many lesson progress records.

⸻

Topics

Represents a concept being taught.

Examples

* Fractions
* Algebra
* Factoring
* Quadratic Equations

Topics are the central entity of the application.

Lessons, questions and prerequisite relationships all originate from topics.

Fields

* id
* name
* description
* difficulty

Relationships

One topic

* has many lessons
* has many questions
* may have many prerequisite relationships

⸻

Lessons

Lessons contain educational content.

Each lesson belongs to exactly one topic.

A topic may contain multiple lessons.

Example

Topic

Quadratic Equations

Lessons

* Introduction
* Solving by Factoring
* Completing the Square

Fields

* id
* topic_id
* title
* content
* estimated_time

Future expansion

Lessons may later include:

* videos
* images
* downloadable resources

⸻

UserLessons

Tracks a student’s progress through individual lessons.

This table exists separately from quiz attempts because reading progress and quiz performance are different concepts.

It allows the application to answer questions such as:

* Has the student started this lesson?
* Has the lesson been completed?
* Where should the student resume?
* Which lessons should be downloaded again during synchronization?

Fields

* id
* user_id
* lesson_id
* status (Not Started, In Progress, Completed)
* last_opened
* completed_at

Relationships

One record belongs to:

* one user
* one lesson

⸻

Questions

Questions assess understanding of a topic.

Each question belongs to exactly one primary topic.

A question should not belong to multiple topics because:

* learning analytics become ambiguous
* mastery calculations become inconsistent
* prerequisite recommendations become difficult

If multi-topic categorization becomes necessary in the future, a tagging system can be introduced without changing the primary relationship.

Fields

* id
* topic_id
* question
* option_a
* option_b
* option_c
* option_d
* correct_option
* difficulty

Future additions

* explanation
* hint
* tags
* image support

⸻

Attempts

Attempts record every answer submitted by a student.

Attempts are never overwritten.

Every submission becomes part of the student’s learning history.

Fields

* id
* user_id
* question_id
* selected_option
* is_correct
* attempted_at

Relationships

One attempt belongs to:

* one user
* one question

This table forms the basis for:

* progress tracking
* mastery calculations
* recommendation engine
* analytics

⸻

Prerequisites

This table stores the learning graph.

Instead of hardcoding prerequisite relationships into the application, they are stored in the database.

Example

Arithmetic

↓

Fractions

↓

Algebra

↓

Factoring

↓

Quadratic Equations

Each row represents one dependency.

Example

Quadratic Equations

requires

Factoring

Fields

* id
* topic_id
* prerequisite_topic_id

This design allows the recommendation engine to traverse prerequisite relationships dynamically.

⸻

Learning Gap Detection

The first version will use deterministic rules.

Example

Student accuracy

Quadratic Equations = 35%

↓

System checks prerequisite

↓

Factoring

↓

Factoring accuracy = 42%

↓

Recommend Factoring

If multiple prerequisite levels exist, traversal continues until an appropriate recommendation is found.

Future versions may incorporate machine learning, but the database design should not depend on it.

⸻

Progress Calculation

The MVP will not store a dedicated progress table.

Instead, progress will be calculated from:

* Attempts
* UserLessons

Together they provide:

* lesson completion
* quiz performance
* mastery percentage
* learning history

If performance becomes an issue later, a cached progress table can be introduced.

⸻

Offline Considerations

Future offline support should synchronize only user-generated data.

Examples

* quiz attempts
* lesson progress
* completed lessons

Educational content such as lessons and questions will be downloaded and cached locally.

The server remains the source of truth after synchronization.

⸻

Future Tables

The following tables are intentionally excluded from the MVP.

Possible future additions

* teacher_accounts
* schools
* classrooms
* achievements
* badges
* notifications
* AI conversations
* lesson_sections
* question_tags
* offline_sync_queue

These features should be implemented without requiring major redesign of the existing schema.

⸻

Design Principles

The database should remain:

* normalized
* readable
* scalable
* maintainable

Avoid storing derived information when it can be calculated reliably.

Prefer explicit relationships over hidden application logic.

Keep the schema flexible enough to support future educational features without breaking existing functionality.