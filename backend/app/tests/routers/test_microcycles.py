import pytest

from ..app import client
from ..fixtures import (TESTING_ACCOUNT_DETAILS, create_access_token_for_user,
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
