import pytest

from .app import TestingSessionLocal, client

TESTING_ACCOUNT_DETAILS = {
    "email": "deadpool@example.com", 
    "username": "Deadpool", 
    "password1": "secret", 
    "password2": "secret"
}
@pytest.fixture
def truncate_database():
    session = TestingSessionLocal()
    session.execute('''DELETE FROM users''')
    session.execute('''DELETE FROM workouts''')
    session.commit()
    session.close()

@pytest.fixture
def create_testing_account():
    response = client.post(
        "/users",
        json=TESTING_ACCOUNT_DETAILS
    )
    return response

@pytest.fixture
def create_alternate_testing_account():
    pass


@pytest.fixture
def create_access_token_for_user(create_testing_account):
    account = create_testing_account
    account_json = account.json()
    response = client.post(
        '/token',
        data={
            "username": TESTING_ACCOUNT_DETAILS.get('username'), 
            "password": TESTING_ACCOUNT_DETAILS.get('password1')
        },
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    return response