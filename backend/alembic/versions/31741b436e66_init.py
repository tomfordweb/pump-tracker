"""init

Revision ID: 31741b436e66
Revises: 
Create Date: 2022-01-01 13:04:35.583449

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '31741b436e66'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('full_name', sa.String(), nullable=True),
    sa.Column('hashed_password', sa.String(), nullable=True),
    sa.Column('disabled', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_table('plans',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('avatar_id', sa.Integer(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_updated', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_plans_avatar_id'), 'plans', ['avatar_id'], unique=False)
    op.create_index(op.f('ix_plans_id'), 'plans', ['id'], unique=False)
    op.create_table('workouts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('is_public', sa.Boolean(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_updated', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_workouts_description'), 'workouts', ['description'], unique=False)
    op.create_index(op.f('ix_workouts_id'), 'workouts', ['id'], unique=False)
    op.create_index(op.f('ix_workouts_name'), 'workouts', ['name'], unique=False)
    op.create_table('workout_plan',
    sa.Column('plans_id', sa.Integer(), nullable=True),
    sa.Column('workouts_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['plans_id'], ['plans.id'], ),
    sa.ForeignKeyConstraint(['workouts_id'], ['workouts.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('workout_plan')
    op.drop_index(op.f('ix_workouts_name'), table_name='workouts')
    op.drop_index(op.f('ix_workouts_id'), table_name='workouts')
    op.drop_index(op.f('ix_workouts_description'), table_name='workouts')
    op.drop_table('workouts')
    op.drop_index(op.f('ix_plans_id'), table_name='plans')
    op.drop_index(op.f('ix_plans_avatar_id'), table_name='plans')
    op.drop_table('plans')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    # ### end Alembic commands ###
