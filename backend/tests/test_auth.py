from backend.tests.conftest import client
from backend.tests.inputs import VALID_USER_1, INVALID_USER_1

def test_create_user(test_db):
    # testing create user
    response = client.post("/auth/", headers={"Content-Type": "application/json"}, json=VALID_USER_1)
    token_user_data = response.json()
    assert response.status_code == 200
    assert token_user_data["username"] == VALID_USER_1["username"]
    assert token_user_data["id"] is not None
    assert token_user_data["access_token"] is not None
    assert token_user_data["token_type"] == "bearer"

    # testing if user already exists
    response2 = client.post("/auth/", headers={"Content-Type": "application/json"}, json={"username": VALID_USER_1["username"], "password": "differentpassword"})
    token_user_data_2 = response2.json()
    assert response2.status_code == 400
    assert token_user_data_2["detail"] == "User already registered"

def test_invalid_login_nonexisting_user(test_db):
    response = client.post("/auth/token/", headers={"Content-Type": "application/x-www-form-urlencoded"}, data=INVALID_USER_1)
    res = response.json()
    assert response.status_code == 401
    assert res["detail"] == "Could not validate credentials"

def test_invalid_login_credentials(test_db):
    response = client.post("/auth/", headers={"Content-Type": "application/json"}, json=VALID_USER_1)
    token_user_data = response.json()
    assert response.status_code == 200
    assert token_user_data["username"] == VALID_USER_1["username"]
    assert token_user_data["id"] is not None
    assert token_user_data["access_token"] is not None
    assert token_user_data["token_type"] == "bearer"

    response2 = client.post("/auth/token/", headers={"Content-Type": "application/x-www-form-urlencoded"}, data=INVALID_USER_1)
    res = response2.json()
    assert response2.status_code == 401
    assert res["detail"] == "Could not validate credentials"

def test_login_token(test_db):
    # testing create user
    response = client.post("/auth/", headers={"Content-Type": "application/json"}, json=VALID_USER_1)
    token_user_data = response.json()
    assert response.status_code == 200
    assert token_user_data["username"] == VALID_USER_1["username"]
    assert token_user_data["id"] is not None
    assert token_user_data["access_token"] is not None
    assert token_user_data["token_type"] == "bearer"

    response2 = client.post("/auth/token/", headers={"Content-Type": "application/x-www-form-urlencoded"}, data=VALID_USER_1)
    token_user_data2 = response2.json()
    assert response2.status_code == 200
    assert token_user_data2["username"] == VALID_USER_1["username"]
    assert token_user_data2["id"] == token_user_data["id"]
    assert token_user_data["access_token"] is not None
    assert token_user_data2["token_type"] == "bearer"

    return token_user_data["access_token"]
