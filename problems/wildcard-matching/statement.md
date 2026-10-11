You are given a text `s` and a pattern `p` that may contain two special symbols: `'?'`, which stands for exactly one arbitrary character, and `'*'`, which stands for any (possibly empty) run of characters.

Decide whether the *entire* text matches the *entire* pattern under these rules — a partial overlap is not enough.

**Example 1:**
```
Input: s = "aa", p = "a"
Output: false
Explanation: One literal "a" cannot cover the two-character text.
```

**Example 2:**
```
Input: s = "aa", p = "*"
Output: true
Explanation: A single star absorbs any text, including all of "aa".
```

**Example 3:**
```
Input: s = "cb", p = "?a"
Output: false
Explanation: "?" matches "c", but then "a" disagrees with "b".
```

**Constraints:**
- `0 <= s.length, p.length <= 2000`
- `s` holds only lowercase English letters.
- `p` holds only lowercase English letters, `'?'`, and `'*'`.
