You play Bulls and Cows against a friend: `secret` is the hidden code and `guess` is your
attempt; both are digit strings of equal length. A bull is a position where both strings
hold the same digit. A cow is a digit that appears in both strings but in different
positions, with each character used at most once (bulls take priority). Return the score as
`"xAyB"`, where `x` counts bulls and `y` counts cows.

**Example 1:**
```
Input: secret = "1807", guess = "7810"
Output: "1A3B"
Explanation: One shared digit sits in place; three more appear shifted.
```

**Example 2:**
```
Input: secret = "1123", guess = "0111"
Output: "1A1B"
Explanation: The middle '1' is a bull; one further '1' matches elsewhere.
```

**Example 3:**
```
Input: secret = "11", guess = "10"
Output: "1A0B"
Explanation: Only the leading '1' matches; the second guess digit has no partner.
```

**Constraints:**
- `1 <= secret.length <= 1000`
- `secret.length == guess.length`
- Both strings contain only digits.
