import pytest
import os
import csv
from weather import validate_file_path, save_to_csv


# ---- Test 1: validate_file_path() ----
def test_validate_file_path(tmp_path):
    # Create a temporary file
    file = tmp_path / "test.csv"
    file.write_text("sample data")

    # Existing file should return True
    assert validate_file_path(str(file)) == True

    # Nonexistent file should return False
    fake_path = tmp_path / "nonexistent.csv"
    assert validate_file_path(str(fake_path)) == False


# ---- Test 2: save_to_csv() ----
def test_save_to_csv(tmp_path, monkeypatch):
    """Test saving weather data to a CSV file"""
    # Redirect FILE_NAME to a temporary path
    temp_file = tmp_path / "weatherdata_history.csv"
    monkeypatch.setattr("weather.FILE_NAME", str(temp_file))

    # Mock tkinter messageboxes to avoid GUI errors
    monkeypatch.setattr("weather.messagebox.showinfo", lambda *args, **kwargs: None)
    monkeypatch.setattr("weather.messagebox.showerror", lambda *args, **kwargs: None)

    # Prepare fake weather data
    sample_data = {
        "name": "Lagos",
        "main": {"temp": 300.15, "humidity": 80},
        "weather": [{"description": "cloudy"}],
        "wind": {"speed": 4.5}
    }

    # Call function
    save_to_csv(sample_data)

    # Assert file was created
    assert os.path.exists(temp_file)

    # Read CSV contents and verify headers + values
    with open(temp_file, newline="") as f:
        reader = list(csv.reader(f))
        assert reader[0] == ["Time", "Location", "Temperature (C)", "Weather", "Humidity", "Wind Speed (m/s)"]
        assert "Lagos" in reader[1]
        assert "cloudy" in reader[1]


if __name__ == "__main__":
    pytest.main(["-v", "--tb=line", "-rN", __file__])
