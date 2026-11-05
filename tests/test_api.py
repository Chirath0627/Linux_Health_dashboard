from run import app


def test_home_endpoint():
    client = app.test_client()

    response = client.get("/")

    assert response.status_code == 200
    assert response.content_type == "text/html; charset=utf-8"
    assert b"Linux System Health Dashboard" in response.data


def test_system_endpoint():
    client = app.test_client()

    response = client.get("/api/system")

    assert response.status_code == 200

    data = response.get_json()

    assert "cpu" in data
    assert "memory" in data
    assert "disk" in data
    assert "system" in data
