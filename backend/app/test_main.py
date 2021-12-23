from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_it_can_create_a_workout():
    response = client.post(
            "/workouts/",
            json={"name": "My test workout", "description": "Test Workout Descriptoin"}
    )

    assert response.status_code == 201
