import pytest

from ..app import client
from ..fixtures import (TESTING_ACCOUNT_DETAILS, WORKOUT_CREATE,
                        create_access_token_for_user, create_basic_workout,
                        create_testing_account, get_token_headers,
                        truncate_database)


@pytest.fixture
def create_basic_microcycle(truncate_database, get_token_headers):
    response = client.post(
            "/microcycles",
            headers=get_token_headers,
            json={
                "name": "Foo",
                "description": "Bar",
                "length_in_days": 7
            }
    )
    return response

def test_you_can_create_a_microcycle(create_basic_microcycle):
    json = create_basic_microcycle.json()
    assert json.get('length_in_days') is 7
    assert json.get('name') == "Foo"
    assert json.get('description') == "Bar"
    assert create_basic_microcycle.status_code == 200


def test_you_can_get_a_microcycle(create_basic_microcycle, get_token_headers):
    json = create_basic_microcycle.json()
    micro_id = json.get('id')

    response = client.get(
            f"/microcycles/{micro_id}",
            headers=get_token_headers,
    )

    json = response.json()
    assert json.get('length_in_days') is 7
    assert json.get('name') == "Foo"
    assert json.get('description') == "Bar"

def test_you_can_add_a_workout_to_a_microcycle_and_then_delete_one(truncate_database, create_basic_microcycle, create_basic_workout, get_token_headers):
    micro_json = create_basic_microcycle.json()

    workout1 = client.post(
            "/workouts",
            headers=get_token_headers,
            json=WORKOUT_CREATE
    )

    workout2 = client.post(
            "/workouts",
            headers=get_token_headers,
            json=WORKOUT_CREATE
    )

    micro_id = micro_json.get('id')

    # this will be deleted.
    response1 = client.post(
            f"/microcycles/{micro_id}/{workout1.json().get('id')}",
            headers=get_token_headers,
            json={
                "microcycle_index": 2
            }
    )

    response2 = client.post(
            f"/microcycles/{micro_id}/{workout2.json().get('id')}",
            headers=get_token_headers,
            json={
                "microcycle_index": 1
            }
    )

    print(response2.json())
    assert response1.status_code == 200
    assert response1.json().get('microcycle_index') == 2
    assert response2.status_code == 200
    assert response2.json().get('microcycle_index') == 1

    session_list_before_delete = client.get(
            f"/microcycles/{micro_id}/sessions",
            headers=get_token_headers,
    )

    assert len(session_list_before_delete.json()) == 2


    deleteResponse = client.delete(
            f"/microcycles/{micro_id}/{workout1.json().get('id')}/2",
            headers=get_token_headers
    )
    assert deleteResponse.status_code == 200

    session_list_post_delete = client.get(
            f"/microcycles/{micro_id}/sessions",
            headers=get_token_headers,
    )

    assert len(session_list_post_delete.json()) == 1
