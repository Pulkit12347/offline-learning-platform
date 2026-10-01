from collections import Counter

from app.repositories.user_repository import UserRepository
from app.schemas.admin import AdminDashboardResponse, GradeCount, UserStats


class AdminService:
    def __init__(self, user_repository: UserRepository) -> None:
        self.users = user_repository

    def dashboard(self) -> AdminDashboardResponse:
        all_users = self.users.list_all()
        students = [u for u in all_users if not u.is_admin]

        total_users = len(all_users)
        verified_users = sum(1 for u in all_users if u.is_verified)
        admin_users = sum(1 for u in all_users if u.is_admin)

        grade_counter: Counter[str] = Counter(
            (u.grade or "Unspecified") for u in students
        )
        users_by_grade = [
            GradeCount(grade=grade, count=count)
            for grade, count in sorted(grade_counter.items())
        ]

        # Performance metrics are scaffolded: once a quiz-attempts source
        # exists, populate these per-student figures from it here.
        student_performance = [
            UserStats.model_validate(student) for student in students
        ]

        return AdminDashboardResponse(
            total_users=total_users,
            verified_users=verified_users,
            unverified_users=total_users - verified_users,
            admin_users=admin_users,
            students=len(students),
            new_users_last_7_days=self.users.count_since(7),
            users_by_grade=users_by_grade,
            total_quizzes_taken=sum(s.quizzes_taken for s in student_performance),
            total_questions_answered=sum(
                s.questions_answered for s in student_performance
            ),
            average_accuracy=self._average_accuracy(student_performance),
            student_performance=student_performance,
        )

    @staticmethod
    def _average_accuracy(rows: list[UserStats]) -> float:
        active = [r for r in rows if r.questions_answered > 0]
        if not active:
            return 0.0
        return round(sum(r.accuracy for r in active) / len(active), 1)
