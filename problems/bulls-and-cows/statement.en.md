You play Bulls and Cows against a friend: `secret` is the hidden code and `guess` is your
attempt; both are digit strings of equal length. A bull is a position where both strings
hold the same digit. A cow is a digit that appears in both strings but in different
positions, with each character used at most once (bulls take priority). Return the score as
`"xAyB"`, where `x` counts bulls and `y` counts cows.

**Constraints:**
- `1 <= secret.length <= 1000`
- `secret.length == guess.length`
- Both strings contain only digits.
