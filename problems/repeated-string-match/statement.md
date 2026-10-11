You are given two strings `a` and `b`. Imagine concatenating copies of `a` (`a`, `a+a`, `a+a+a`, and so on).

Return the smallest number of copies whose concatenation contains `b` as a contiguous block, or `-1` when no repetition contains `b`.

**Example 1:**
```
Input: a = "abcd", b = "cdabcdab"
Output: 3
Explanation: "abcdabcdabcd" contains "cdabcdab".
```

**Example 2:**
```
Input: a = "a", b = "aa"
Output: 2
```

**Example 3:**
```
Input: a = "abc", b = "wxyz"
Output: -1
```

**Constraints:**
- `1 <= a.length, b.length <= 10^4`
- Both strings use lowercase English letters.
