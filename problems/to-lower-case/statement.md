Convert every uppercase English letter in `s` to its lowercase form and return the result.

Only characters from `A` to `Z` change. Lowercase letters, digits, spaces, punctuation and any other symbols stay exactly as they are. The transformation is done character by character from left to right.

**Example 1:**
```
Input: s = "Hello"
Output: "hello"
Explanation: The leading H becomes h while the remaining characters are already lowercase.
```

**Example 2:**
```
Input: s = "LOVELY"
Output: "lovely"
Explanation: Each of the six uppercase letters maps to its lowercase partner.
```

**Example 3:**
```
Input: s = "a1B2!"
Output: "a1b2!"
Explanation: B becomes b; the digit and punctuation characters do not change.
```

**Constraints:**
- `1 <= s.length <= 100`
- `s` consists of printable ASCII characters.
