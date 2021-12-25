import pytest

from .app import TestingSessionLocal


@pytest.fixture
def truncate_database():
    session = TestingSessionLocal()
    session.execute('''DELETE FROM users''')
    session.execute('''DELETE FROM workouts''')
    session.commit()
    session.close()
