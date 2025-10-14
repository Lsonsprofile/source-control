import pytest
from weather import is_data_ok, validate_file_path

# ---- Test 1: Test the is_data_ok() function ----
def test_is_data_ok():
    # Valid data (should return True)
    valid_data = {
        "main": {"temp": 298, "humidity": 60},
        "weather": [{"description": "clear sky"}],
        "name": "London"
    }
    assert is_data_ok(valid_data) == True

    # Missing "main" key (should return False)
    invalid_data_1 = {
        "weather": [{"description": "rain"}],
        "name": "Paris"
    }
    assert is_data_ok(invalid_data_1) == False

    # Empty dictionary (should return False)
    assert is_data_ok({}) == False


# ---- Test 2: Test the validate_file_path() function ----
def test_validate_file_path(tmp_path):
    # Create a temporary file
    file = tmp_path / "test.csv"
    file.write_text("sample data")

    # Existing file should return True
    assert validate_file_path(str(file)) == True

    # Nonexistent file should return False
    fake_path = tmp_path / "nonexistent.csv"
    assert validate_file_path(str(fake_path)) == False


if __name__ == "__main__":
    pytest.main(['-v', '--tb=line', '-rN', __file__])
