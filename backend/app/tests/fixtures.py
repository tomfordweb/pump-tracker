import pytest

from .app import TestingSessionLocal, client

TESTING_ACCOUNT_DETAILS = {
    "email": "deadpool@example.com", 
    "username": "Deadpool", 
    "password1": "secret", 
    "password2": "secret"
}


WORKOUT_CREATE = {
    "name": "My test workout", 
    "is_public": False, 
    "description": 
    "Test Workout"
}

@pytest.fixture
def truncate_database():
    session = TestingSessionLocal()
    session.execute('''DELETE FROM users''')
    session.execute('''DELETE FROM workouts''')
    session.execute('''DELETE FROM microcycle_workout''')
    session.execute('''DELETE FROM microcycles''')
    session.execute('''DELETE FROM exercises''')
    session.commit()
    session.close()

@pytest.fixture
def create_testing_account():
    response = client.post(
        "/users",
        json=TESTING_ACCOUNT_DETAILS
    )
    assert response.status_code == 200
    return response

@pytest.fixture
def create_access_token_for_user(create_testing_account):
    account = create_testing_account
    response = client.post(
        '/token',
        data={
            "username": TESTING_ACCOUNT_DETAILS.get('username'), 
            "password": TESTING_ACCOUNT_DETAILS.get('password1')
        },
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    assert response.status_code == 200
    return response

@pytest.fixture
def get_token_headers(create_access_token_for_user):
    token = create_access_token_for_user.json().get('access_token')
    assert token is not None
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def create_basic_workout(get_token_headers):
    response = client.post(
            "/workouts",
            headers=get_token_headers,
            json=WORKOUT_CREATE
    )
    return response
