from ... import models
from ...database import Base
from ...dependencies import get_db
from ...main import app
from ..app import TestingSessionLocal, client
from ..fixtures import (TESTING_ACCOUNT_DETAILS, create_access_token_for_user,
                        create_testing_account, truncate_database)


def test_create_user(truncate_database, create_testing_account):
    assert create_testing_account.status_code == 200
    data = create_testing_account.json()
    assert data["email"] == TESTING_ACCOUNT_DETAILS.get('email')
    assert "id" in data
    assert "password" not in create_testing_account.text

def test_create_user_rejects_duplicate_username(truncate_database, create_testing_account):
    assert create_testing_account.status_code == 200

    response = client.post(
        "/users",
        json={
            **TESTING_ACCOUNT_DETAILS,
            **{"email": "someUniqueEmail@example.com"}, 
        },
    )
    assert response.status_code == 400
    assert "username" in response.text


def test_create_user_only_accepts_alphanumeric_username(truncate_database):
    response = client.post(
        "/users",
        json={**TESTING_ACCOUNT_DETAILS, **{"username": "!@#$**#*#("}},
    )
    assert response.status_code == 422
    assert "alphanumeric" in response.text

def test_create_user_rejects_emails_that_are_not_emails(truncate_database):
    response = client.post(
        "/users",
        json={**TESTING_ACCOUNT_DETAILS, **{"email": "asdf"}},
    )
    assert response.status_code == 422
    assert response.json().get('detail').get('field_errors').get('email') is not None


def test_you_can_get_a_token(truncate_database, create_access_token_for_user):
    assert create_access_token_for_user.status_code == 200
    assert "token" in create_access_token_for_user.text


def test_you_can_hit_the_user_healthcheck_route(truncate_database, create_access_token_for_user):
    assert create_access_token_for_user.status_code == 200
    token = create_access_token_for_user.json().get('access_token')

    assert token is not None

    response = client.get(
            '/users/me',
            headers={'Authorization': f"Bearer {token}"}
    )

    assert "deadpool@example.com" in response.text
    assert "password" not in response.text


def test_create_user_rejects_duplicate_email(truncate_database, create_testing_account):
    response = client.post(
        "/users",
        json={**TESTING_ACCOUNT_DETAILS, **{"username": "somethingtrulyunique"}},
    )
    assert response.status_code == 400
    assert "email" in response.text


def test_you_can_get_a_list_of_user_workouts():
    pass

def test_you_can_get_a_list_of_user_plans():
    pass

def test_you_can_get_a_list_of_user_exercises():
    pass
