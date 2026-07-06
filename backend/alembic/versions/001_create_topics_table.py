"""create topics table

Revision ID: 001_create_topics
Revises:
Create Date: 2026-07-04

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001_create_topics"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

SEED_TOPICS = [
    {
        "name": "Arithmetic",
        "description": "Build a strong foundation in basic operations including addition, subtraction, multiplication, and division.",
        "difficulty": "beginner",
    },
    {
        "name": "Fractions",
        "description": "Learn to work with parts of a whole, equivalent fractions, and operations involving fractions.",
        "difficulty": "beginner",
    },
    {
        "name": "Algebra",
        "description": "Introduce variables, expressions, and equations to solve real-world mathematical problems.",
        "difficulty": "intermediate",
    },
    {
        "name": "Factoring",
        "description": "Break down polynomials into simpler components and apply factoring techniques to solve equations.",
        "difficulty": "intermediate",
    },
    {
        "name": "Quadratic Equations",
        "description": "Solve equations of the form ax² + bx + c = 0 using factoring, completing the square, and the quadratic formula.",
        "difficulty": "advanced",
    },
]


def upgrade() -> None:
    topics_table = op.create_table(
        "topics",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("difficulty", sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.bulk_insert(topics_table, SEED_TOPICS)


def downgrade() -> None:
    op.drop_table("topics")
