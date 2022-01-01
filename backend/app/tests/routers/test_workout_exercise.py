from ..app import client
from ..fixtures import (TESTING_ACCOUNT_DETAILS, create_access_token_for_user,
                        create_testing_account, get_token_headers,
                        truncate_database)
from .test_exercises import create_basic_exercise
from .test_workouts import create_basic_workout


def test_adding_and_removing_exercises_to_workouts_you_do_not_own(truncate_database, create_basic_workout, create_basic_exercise, get_token_headers):
    workout_id = create_basic_workout.json().get('id')
    exercise_id = create_basic_exercise.json().get('id')

    client.post(
        f"/workouts/{workout_id}/exercises/{exercise_id}",
        headers=get_token_headers,
    )

    client.get(
        f"/workouts/{workout_id}/exercises",
        headers=get_token_headers,
    )

    user_2 = client.post(
        "/users",
        json={**TESTING_ACCOUNT_DETAILS, **{"username" : "unique123", "email": "unique@example.com"}}
    )

    assert user_2.status_code == 200

    token_response = client.post(
        '/token',
        data={
            "username": "unique123", 
            "password": TESTING_ACCOUNT_DETAILS.get('password1')
        },
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    assert token_response.status_code == 200
    token = token_response.json().get('access_token')
    new_user_headers = {"Authorization": f"Bearer {token}"}

    invalid_add = client.post(
        f"/workouts/{workout_id}/exercises/{exercise_id}",
        headers=new_user_headers,
    )
    assert invalid_add.status_code == 403

    invalid_delete = client.delete(
        f"/workouts/{workout_id}/exercises/{exercise_id}",
        headers=new_user_headers,
    )
    assert invalid_delete.status_code == 403


def test_adding_and_removing_exercises_to_workouts_you_own(truncate_database, create_basic_workout, create_basic_exercise, get_token_headers):
    workout_id = create_basic_workout.json().get('id')
    exercise_id = create_basic_exercise.json().get('id')

    response = client.post(
        f"/workouts/{workout_id}/exercises/{exercise_id}",
        headers=get_token_headers,
    )

    response = client.get(
        f"/workouts/{workout_id}/exercises",
        headers=get_token_headers,
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert create_basic_exercise.json().get('name') in response.text

    response = client.delete(
        f"/workouts/{workout_id}/exercises/{exercise_id}",
        headers=get_token_headers,
    )

    response = client.get(
        f"/workouts/{workout_id}/exercises",
        headers=get_token_headers,
    )

    assert response.status_code == 200
    assert len(response.json()) == 0
