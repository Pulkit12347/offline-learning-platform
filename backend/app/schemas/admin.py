from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserStats(BaseModel):
    """Per-student performance row for the admin dashboard.

    Quiz/attempt metrics are scaffolded and read zero until the quizzes
    feature ships; the shape is stable so the UI won't change later.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    grade: str | None
    is_verified: bool
    created_at: datetime
    quizzes_taken: int = 0
    questions_answered: int = 0
    correct_answers: int = 0
    accuracy: float = 0.0


class GradeCount(BaseModel):
    grade: str
    count: int


class AdminDashboardResponse(BaseModel):
    total_users: int
    verified_users: int
    unverified_users: int
    admin_users: int
    students: int
    new_users_last_7_days: int
    users_by_grade: list[GradeCount]
    # Aggregate performance across all students (zero until quizzes ship).
    total_quizzes_taken: int = 0
    total_questions_answered: int = 0
    average_accuracy: float = 0.0
    student_performance: list[UserStats]
