from address import extract_city, extract_state, extract_zipcode
import pytest

def test_extract_city():
    """Test the extract_city function."""
    assert extract_city("123 Main St, Rexburg, ID 83440") == "Rexburg"
    # More cases
    assert extract_city("456 Elm Street, Los Angeles, CA 90001") == "Los Angeles"
    assert extract_city("789 Pine Ave, New York, NY 10001") == "New York"
    # Edge case with extra spaces
    assert extract_city("  789 Pine Ave ,   New York  , NY 10001  ") == "New York"

def test_extract_state():
    """Test the extract_state function."""
    assert extract_state("123 Main St, Rexburg, ID 83440") == "ID"
    assert extract_state("456 Elm Street, Los Angeles, CA 90001") == "CA"
    assert extract_state("789 Pine Ave, New York, NY 10001") == "NY"
    # Edge case with extra spaces
    assert extract_state("  789 Pine Ave ,   New York  , NY 10001  ") == "NY"

def test_extract_zipcode():
    """Test the extract_zipcode function."""
    assert extract_zipcode("123 Main St, Rexburg, ID 83440") == "83440"
    assert extract_zipcode("456 Elm Street, Los Angeles, CA 90001") == "90001"
    assert extract_zipcode("789 Pine Ave, New York, NY 10001") == "10001"
    # Edge case with trailing spaces
    assert extract_zipcode("  789 Pine Ave ,   New York  , NY 10001  ") == "10001"


pytest.main(['-v', '--tb=line', '-rN', __file__])
