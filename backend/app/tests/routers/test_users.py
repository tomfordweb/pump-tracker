import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .. import models
from ..database import Base
from ..dependencies import get_db
from ..main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///.test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


models.Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture
def truncate_database():
    session = TestingSessionLocal()
    session.execute('''DELETE FROM users''')
    session.execute('''DELETE FROM workouts''')
    session.commit()
    session.close()


def test_create_user(truncate_database):
    response = client.post(
        "/users",
        json={"email": "deadpool@example.com", "username": "deadpool", "password1": "chimichangas4life", "password2": "chimichangas4life"},
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "deadpool@example.com"
    assert "id" in data
    assert "password" not in response.text
    user_id = data["id"]

def test_create_user_rejects_duplicate_username(truncate_database):
    username="deadpool2"
    response = client.post(
        "/users",
        json={"email": "deadpool@example.com", "username": username, "password1": "chimichangas4life", "password2": "chimichangas4life"},
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "deadpool@example.com"
    assert "id" in data

    response = client.post(
        "/users",
        json={"email": "deadpool+alternate@example.com", "username": username, "password1": "chimichangas4life", "password2": "chimichangas4life"},
    )
    assert response.status_code == 400
    assert "username" in response.text


def test_create_user_only_accepts_alphanumeric_username(truncate_database):
    response = client.post(
        "/users",
        json={"email": "john@example.com", "username": "!@#$**#*#(", "password1": "chimichangas4life", "password2": "chimichangas4life"},
    )
    assert response.status_code == 422
    assert "alphanumeric" in response.text

def test_create_user_rejects_emails_that_are_not_emails(truncate_database):
    response = client.post(
        "/users",
        json={"email": "asdf", "username": "tomtom", "password1": "chimichangas4life", "password2": "chimichangas4life"},
    )
    assert response.status_code == 422
    assert "value_error.emailsyntax" in response.text


def test_you_can_get_a_token(truncate_database):
    username="deadpool"
    password="secret"
    response = client.post(
        "/users",
        json={"email": "deadpool@example.com", "username": username, "password1": password, "password2": password},
    )
    assert response.status_code == 200, response.text

    response = client.post(
            '/token',
            data={"username": username, "password": password},
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    assert response.status_code == 200
    assert "token" in response.text


def test_you_can_hit_the_user_healthcheck_route(truncate_database):
    username="deadpool"
    password="secret"
    response = client.post(
        "/users",
        json={"email": "deadpool@example.com", "username": username, "password1": password, "password2": password},
    )
    assert response.status_code == 200, response.text

    response = client.post(
            '/token',
            data={"username": username, "password": password},
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    assert response.status_code == 200
    token = response.json().get('access_token')
    assert token is not None

    response = client.get(
            '/users/me',
            headers={'Authorization': f"Bearer {token}"}
    )

    assert "deadpool@example.com" in response.text
    assert "password" not in response.text





def test_create_user_rejects_duplicate_email(truncate_database):
    email="deadpool@example.com"
    response = client.post(
        "/users",
        json={"email": email, "username": "test1", "password1": "chimichangas4life", "password2": "chimichangas4life"},
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == "deadpool@example.com"
    assert "id" in data

    response = client.post(
        "/users",
        json={"email": email, "username": "test2", "password1": "chimichangas4life", "password2": "chimichangas4life"},
    )
    assert response.status_code == 400
    assert "email" in response.text


def test_that_an_unauthenticated_user_cannot_create_a_workout():
    response = client.post(
            "/workouts",
            headers={"X-Token": "someToken"},
            json={"name": "My test workout", "description": "Test Workout Descriptoin"}
    )

    assert response.status_code == 401
