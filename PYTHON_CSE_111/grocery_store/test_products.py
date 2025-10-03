# test_products.py
import pytest
from receipt import read_dictionary


def test_products():
    """Test that the products.csv file loads correctly."""
    products_dict = read_dictionary("PYTHON_CSE_111/grocery_store/products.csv", 0)

    # Check that dictionary is not empty
    assert len(products_dict) > 0, "Products dictionary should not be empty"

    # Check for a known key
    assert "D150" in products_dict, "Milk (D150) should be in products.csv"

    # Check values
    milk = products_dict["D150"]
    assert milk[1] == "1 gallon milk", "Product name for D150 should be '1 gallon milk'"
    assert float(milk[2]) == 2.85, "Price for D150 should be 2.85"


def test_requests():
    """Test that the request.csv file loads correctly."""
    request_dict = read_dictionary("PYTHON_CSE_111/grocery_store/request.csv", 0)

    # Check dictionary is not empty
    assert len(request_dict) > 0, "Request dictionary should not be empty"

    # Check that request contains at least one known product
    assert "W112" in request_dict or "D083" in request_dict, "Expected product missing in request.csv"


if __name__ == "__main__":
    pytest.main(["-v", "--tb=line", "-rN", __file__])
