import pytest

from ..app import client
from ..fixtures import (TESTING_ACCOUNT_DETAILS, create_access_token_for_user,
                        create_testing_account, get_token_headers,
                        truncate_database)

WORKOUT_CREATE = {"name": "My test workout", "is_public": False, "description": "Test Workout"}


@pytest.fixture
def create_basic_workout(get_token_headers):
    response = client.post(
            "/workouts",
            headers=get_token_headers,
            json=WORKOUT_CREATE
    )
    return response

def test_that_an_unauthenticated_user_cannot_create_a_workout(truncate_database):
    response = client.post(
            "/workouts",
            headers={"X-Token": "someToken"},
            json=WORKOUT_CREATE
    )

    assert response.status_code == 401


def test_you_can_create_a_workout(truncate_database, create_basic_workout):
    assert create_basic_workout.status_code == 200
    json  = create_basic_workout.json()
    assert json.get('id') is not None
    assert json.get('owner_id') is not None
    assert WORKOUT_CREATE.get('name') == json.get('name')


def test_you_can_get_a_list_of_workouts(truncate_database, get_token_headers):
    client.post(
            "/workouts",
            headers=get_token_headers,
            json=WORKOUT_CREATE
    )
    client.post(
            "/workouts",
            headers=get_token_headers,
            json={**WORKOUT_CREATE, **{'name': 'foobarbaz'}}
    )
    response = client.get(
            "/workouts",
            headers=get_token_headers,
    )
    assert response.status_code == 200
    assert len(response.json()) is 2
    assert "foobarbaz" in response.text

def test_a_private_workout_is_private_and_it_can_be_updated_to_a_public_workout_and_is_visible_to_someone_who_isnt_the_owner(truncate_database, get_token_headers):
    """ Create a workout that is private under the fixture user """
    private_workout = client.post(
            "/workouts",
            headers=get_token_headers,
            json={**WORKOUT_CREATE, **{'name': 'foobarbaz'}}
    )
    private_workout_id = private_workout.json().get('id')
    assert private_workout.status_code == 200
    assert private_workout.json().get('is_public') == False

    """ Make sure we can actually view the workout as ourselves """
    private_workout_detail = client.get(
            f"/workouts/{private_workout_id}",
            headers=get_token_headers,
    )

    assert private_workout_detail.status_code == 200
    assert private_workout_detail.json().get('name') == 'foobarbaz'

    """ Create a new user, get their token """
    create = client.post(
        "/users",
        json={ **TESTING_ACCOUNT_DETAILS, **{'username': 'tester', 'email': 'pumptracker@example.com'}}
    )

    assert create.status_code == 200
    token_response = client.post(
        '/token',
        data={
            "username": "tester",
            "password": TESTING_ACCOUNT_DETAILS.get('password1')
        },
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    assert token_response.status_code == 200

    token = token_response.json().get('access_token')
    assert token is not None
    user_2_token_headers = {"Authorization": f"Bearer {token}"}

    """ User 2 should not be able to view the workout since it is private """
    private_workout_detail = client.get(
            f"/workouts/{private_workout_id}",
            headers=user_2_token_headers,
    )

    assert private_workout_detail.status_code == 403

    """ Now the workout will be updated to be public """

    private_workout_update_response = client.put(
            f"/workouts/{private_workout_id}",
            headers=get_token_headers,
            json={'is_public': True}
    )
    assert private_workout_update_response.status_code == 200
    assert private_workout_update_response.json().get('is_public') == True

    """ User 2 should now be able to view the workout since it is public """
    public_workout_detail = client.get(
            f"/workouts/{private_workout_id}",
            headers=user_2_token_headers,
    )

    assert public_workout_detail.status_code == 200
    assert public_workout_detail.json().get('name') == "foobarbaz"

    """ User 2 is not able to modify the workout of user 1 even though it is public """

    invalid_workout_update = client.put(
            f"/workouts/{private_workout_id}",
            headers=user_2_token_headers,
            json={'is_public': True}
    )
    assert invalid_workout_update.status_code == 403


def test_that_when_a_workout_does_not_exist_that_a_404_is_thrown(truncate_database, get_token_headers):
    response = client.get(
            "/workouts/9001",
            headers=get_token_headers,
    )
    assert response.status_code == 404


# def test_you_can_fork_a_workout():
#     """
#     An idea...
#     The workout should be private
#     The workout cannot be public
#     """
