"""add owner and date columns to plans

Revision ID: 81857ff7123d
Revises: 63c50e65e010
Create Date: 2021-12-25 19:20:24.816867

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '81857ff7123d'
down_revision = '63c50e65e010'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
            'plans', 
            sa.Column('user_id', sa.Integer, nullable=False), 
    )
    op.add_column(
            'plans', 
            sa.Column('date_created', sa.DateTime, nullable=False), 
    )
    op.add_column(
            'plans', 
            sa.Column('date_updated', sa.DateTime, nullable=False)
    )


def downgrade():
    op.dropColumn('plans', 'user_id')
    op.dropColumn('plans', 'date_created')
    op.dropColumn('plans', 'date_updated')
