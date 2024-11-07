from .conftest import client
from . import test_auth
from .inputs import VALID_USER_1, VALID_LOG_1, START_DATE, END_DATE
from .utils import parse_time_string, get_year, get_month

def test_home_without_login(test_db):
    response = client.get("/", headers={"Content-Type": "application/json"})
    data = response.json()
    assert response.status_code == 401
    assert data["detail"] == "Not authenticated"

def test_home_with_login(test_db):
    response_token = test_auth.test_login_token(test_db)
    response = client.get("/", headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"})
    assert response.status_code == 200

def test_delete_user(test_db):
    response_token = test_auth.test_login_token(test_db)
    deleted_user = client.delete("/user/delete/", headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"})
    data = deleted_user.json()
    assert deleted_user.status_code == 200
    assert data["username"] == VALID_USER_1["username"]
    assert data["id"] is not None
    assert data["logs"] is not None

def test_invalid_delete_user(test_db):
    deleted_user = client.delete("/user/delete/", headers={"Content-Type": "application/json", "Authorization": "Bearer 12345"})
    assert deleted_user.status_code == 401

def test_add_log(test_db):
    response_token = test_auth.test_login_token(test_db)
    response = client.post("/log/", headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"}, json=VALID_LOG_1)
    data = response.json()
    assert response.status_code == 200
    assert data["description"] == VALID_LOG_1["description"]
    assert data["log_date"] == VALID_LOG_1["log_date"]
    assert parse_time_string(data["log_time"]) == parse_time_string(VALID_LOG_1["log_time"])
    assert data["duration_minutes"] == VALID_LOG_1["duration_minutes"]
    assert data["id"] is not None
    assert data["author_id"] is not None

# def test_add_invalid_log(test_db):
#     return

def test_get_logs(test_db):
    response_token = test_auth.test_login_token(test_db)
    client.post("/log/", headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"}, json=VALID_LOG_1)
    response = client.get("/logs/", headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"})
    data = (response.json())[0]
    assert response.status_code == 200
    assert data["description"] == VALID_LOG_1["description"]
    assert data["log_date"] == VALID_LOG_1["log_date"]
    assert parse_time_string(data["log_time"]) == parse_time_string(VALID_LOG_1["log_time"])
    assert data["duration_minutes"] == VALID_LOG_1["duration_minutes"]
    assert data["id"] is not None
    assert data["author_id"] is not None

def test_get_logs_month(test_db):
    response_token = test_auth.test_login_token(test_db)
    client.post("/log/", headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"}, json=VALID_LOG_1)
    response = client.get(
        f"/logs/month/?year={get_year(VALID_LOG_1['log_date'])}&month={str(int(get_month(VALID_LOG_1['log_date'])))}",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"},
    )
    data = (response.json())[0]
    assert response.status_code == 200
    assert data["description"] == VALID_LOG_1["description"]
    assert data["log_date"] == VALID_LOG_1["log_date"]
    assert parse_time_string(data["log_time"]) == parse_time_string(VALID_LOG_1["log_time"])
    assert data["duration_minutes"] == VALID_LOG_1["duration_minutes"]
    assert data["id"] is not None
    assert data["author_id"] is not None

def test_get_logs_range(test_db):
    response_token = test_auth.test_login_token(test_db)
    client.post("/log/", headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"}, json=VALID_LOG_1)
    response = client.get(
        f"/logs/range/?start_date={START_DATE}&end_date={END_DATE}",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"},
    )
    data = (response.json())[0]
    assert response.status_code == 200
    assert data["description"] == VALID_LOG_1["description"]
    assert data["log_date"] == VALID_LOG_1["log_date"]
    assert parse_time_string(data["log_time"]) == parse_time_string(VALID_LOG_1["log_time"])
    assert data["duration_minutes"] == VALID_LOG_1["duration_minutes"]
    assert data["id"] is not None
    assert data["author_id"] is not None

def test_delete_log(test_db):
    response_token = test_auth.test_login_token(test_db)
    client.post("/log/", headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"}, json=VALID_LOG_1)
    response = client.delete(
        f"/logs/delete/?date={VALID_LOG_1['log_date']}",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {response_token}"},
    )
    data = (response.json())[0]
    assert response.status_code == 200
    assert data["description"] == VALID_LOG_1["description"]
    assert data["log_date"] == VALID_LOG_1["log_date"]
    assert parse_time_string(data["log_time"]) == parse_time_string(VALID_LOG_1["log_time"])
    assert data["duration_minutes"] == VALID_LOG_1["duration_minutes"]
    assert data["id"] is not None
    assert data["author_id"] is not None