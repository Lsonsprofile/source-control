"""
Pytest suite for W02 Project: Password Strength

Each test corresponds to a rubric item:
1) main() / test_password()
2) password_strength()
3) word_in_file()
4) word_complexity()
5) word_has_character()
6) dictionary & top password file checks
7) length rules
8) complexity scoring
9) creativity (missing_character_type)
"""

import types
import math
import pytest
import passwords  # import your passwords.py file

# ---------- 1. main function exists ----------
def test_main_function_exists():
    """Check that main() exists and is a function."""
    assert hasattr(passwords, "main")
    assert isinstance(passwords.main, types.FunctionType)

# ---------- 2. test_password function exists and calls password_strength ----------
def test_test_password_function():
    """Check that test_password() exists and returns same as password_strength()."""
    assert hasattr(passwords, "test_password")
    pw = "ValidPass123!"
    result1 = passwords.test_password(pw)
    result2 = passwords.password_strength(pw)
    assert result1 == result2

# ---------- 3. word_in_file ----------
def test_word_in_file_case_sensitivity(tmp_path):
    """Check case-sensitive and case-insensitive matches."""
    f = tmp_path / "words.txt"
    f.write_text("Secret\npassword\n")
    # case-insensitive should find
    assert passwords.word_in_file("secret", str(f), case_sensitive=False)
    # case-sensitive should not find uppercase mismatch
    assert not passwords.word_in_file("SECRET", str(f), case_sensitive=True)

# ---------- 4. word_complexity ----------
def test_word_complexity_scoring():
    """Check complexity scores for different inputs."""
    pw = "aA1!"  # lower, upper, digit, special
    assert passwords.word_complexity(pw) == 4
    pw2 = "abc"  # only lower
    assert passwords.word_complexity(pw2) == 1

# ---------- 5. word_has_character ----------
def test_word_has_character_lists():
    """Check word_has_character against lists."""
    assert passwords.word_has_character("abc", passwords.LOWER)
    assert not passwords.word_has_character("123", passwords.UPPER)

# ---------- 6 & 7. Dictionary and Top Password file checks ----------
def test_dictionary_and_top_password_check(monkeypatch):
    """Fake dictionary and top password files to check 0 strength."""
    def fake_word_in_file(word, filename, case_sensitive=False):
        if filename.endswith("toppasswords.txt"):
            return word == "123456"
        if filename.endswith("wordlist.txt"):
            return word.lower() == "mypassword"
        return False

    monkeypatch.setattr(passwords, "word_in_file", fake_word_in_file)

    # dictionary word
    assert passwords.password_strength("mypassword") == 0
    # top password
    assert passwords.password_strength("123456") == 0

# ---------- 8. Length check - too short ----------
def test_short_password_returns_1():
    """Passwords shorter than 10 characters should return 1."""
    short_pw = "Ab1!"
    score = passwords.password_strength(short_pw)
    assert score == 1

# ---------- 9. Length check - strong (>15) ----------
def test_long_password_returns_5():
    """Passwords longer than 15 characters should return 5."""
    long_pw = "VeryLongPassword123!"
    score = passwords.password_strength(long_pw)
    assert score == 5

# ---------- 10. Complexity scoring ----------
def test_complexity_score_matches_strength():
    """Strength score equals complexity score when not short or long."""
    pw = "aA1!"  # lower, upper, digit, special
    # still <16 chars so no length override
    score = passwords.password_strength(pw * 2)
    assert score == passwords.word_complexity(pw * 2)

# ---------- 11. Creativity (missing_character_type) ----------
def test_missing_character_type_function_exists():
    """Check that missing_character_type exists and returns missing categories."""
    assert hasattr(passwords, "missing_character_type")
    missing = passwords.missing_character_type("aaaa")  # only lowercase
    assert "uppercase" in missing
    assert "digits" in missing
