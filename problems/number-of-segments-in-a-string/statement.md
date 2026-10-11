A segment is a maximal run of characters that contains no spaces: it starts after a space (or at the string start) and ends before the next space (or at the string end). Given a string `s`, count how many such segments it holds.

**Example 1:**
```
Input: s = "Hello, my name is John"
Output: 5
Explanation: The runs "Hello,", "my", "name", "is" and "John" make five.
```

**Example 2:**
```
Input: s = "Hello"
Output: 1
Explanation: A single word with no spaces is one segment.
```

**Example 3:**
```
Input: s = "   extra   gaps   "
Output: 2
Explanation: Leading, trailing and repeated spaces contribute nothing; only "extra" and "gaps" count.
```

**Constraints:**
- `0 <= s.length <= 300`
- `s` uses letters, digits, punctuation and the space character only.
