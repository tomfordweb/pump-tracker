"""create plans table

Revision ID: 63c50e65e010
Revises: 
Create Date: 2021-12-25 19:13:21.040149

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '63c50e65e010'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'plans',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('avatar_id', sa.Integer, nullable=True)
    )


def downgrade():
    op.drop_table('plans')
