"""rename plan to microcycle

Revision ID: 7dcbf6f79336
Revises: 63b3cb22423c
Create Date: 2022-02-13 16:12:09.563507

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7dcbf6f79336'
down_revision = '63b3cb22423c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('microcycles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('avatar_id', sa.Integer(), nullable=True),
    sa.Column('length_in_days', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_updated', sa.DateTime(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('microcycles', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_microcycles_avatar_id'), ['avatar_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_microcycles_id'), ['id'], unique=False)

    with op.batch_alter_table('plans', schema=None) as batch_op:
        batch_op.drop_index('ix_plans_avatar_id')
        batch_op.drop_index('ix_plans_id')

    op.drop_table('plans')
    with op.batch_alter_table('microcycle_workout', schema=None) as batch_op:
        batch_op.add_column(sa.Column('microcycle_id', sa.Integer(), nullable=False))
        batch_op.drop_constraint('microcycle_workout_plan_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'microcycles', ['microcycle_id'], ['id'])
        batch_op.drop_column('plan_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('microcycle_workout', schema=None) as batch_op:
        batch_op.add_column(sa.Column('plan_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('microcycle_workout_plan_id_fkey', 'plans', ['plan_id'], ['id'])
        batch_op.drop_column('microcycle_id')

    op.create_table('plans',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('avatar_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('owner_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('date_created', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('date_updated', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('length_in_days', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], name='plans_owner_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='plans_pkey')
    )
    with op.batch_alter_table('plans', schema=None) as batch_op:
        batch_op.create_index('ix_plans_id', ['id'], unique=False)
        batch_op.create_index('ix_plans_avatar_id', ['avatar_id'], unique=False)

    with op.batch_alter_table('microcycles', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_microcycles_id'))
        batch_op.drop_index(batch_op.f('ix_microcycles_avatar_id'))

    op.drop_table('microcycles')
    # ### end Alembic commands ###
