from ..app import client
from ..fixtures import truncate_database


def test_that_an_unauthenticated_user_cannot_create_a_workout(truncate_database):
    response = client.post(
            "/workouts",
            headers={"X-Token": "someToken"},
            json={"name": "My test workout", "description": "Test Workout Descriptoin"}
    )

    assert response.status_code == 401
