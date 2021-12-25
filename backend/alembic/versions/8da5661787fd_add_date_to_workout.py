"""add date to workout

Revision ID: 8da5661787fd
Revises: 8c785cc234ff
Create Date: 2021-12-25 19:48:46.947776

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '8da5661787fd'
down_revision = '8c785cc234ff'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
            'workouts', 
            sa.Column('date_created', sa.DateTime, nullable=False), 
    )
    op.add_column(
            'workouts', 
            sa.Column('date_updated', sa.DateTime, nullable=False)
    )


def downgrade():
    op.dropColumn('workouts', 'date_created')
    op.dropColumn('workouts', 'date_updated')
