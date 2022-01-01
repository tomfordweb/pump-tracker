from ..app import client
from ..fixtures import (TESTING_ACCOUNT_DETAILS, create_access_token_for_user,
                        create_testing_account, get_token_headers,
                        truncate_database)

EXERCISE_CREATE = {"name": "Squat", "description": "The best exercise known to man"}


def test_that_an_unauthenticated_user_cannot_create_a_exercise(truncate_database):
    response = client.post(
            "/exercises",
            headers={"X-Token": "someToken"},
            json=EXERCISE_CREATE
    )

    assert response.status_code == 401


def test_you_can_create_a_exercise(truncate_database, get_token_headers):
    response = client.post(
            "/exercises",
            headers=get_token_headers,
            json=EXERCISE_CREATE
    )
    assert response.status_code == 200
    json  = response.json()
    assert json.get('id') is not None
    assert json.get('owner_id') is not None
    assert EXERCISE_CREATE.get('name') == json.get('name')


def test_you_can_get_a_list_of_exercises(truncate_database, get_token_headers):
    client.post(
            "/exercises",
            headers=get_token_headers,
            json=EXERCISE_CREATE
    )
    client.post(
            "/exercises",
            headers=get_token_headers,
            json={**EXERCISE_CREATE, **{'name': 'foobarbaz'}}
    )
    response = client.get(
            "/exercises",
            headers=get_token_headers,
    )
    assert response.status_code == 200
    assert len(response.json()) is 2
    assert "foobarbaz" in response.text


def test_that_when_a_exercise_does_not_exist_that_a_404_is_thrown(truncate_database, get_token_headers):
    response = client.get(
            "/exercises/9001",
            headers=get_token_headers,
    )
    assert response.status_code == 404
