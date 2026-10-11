Given a decimal string `n` (no leading zeros except `"0"` itself), return the closest palindromic integer different from `n` itself, as a string. Closeness is measured by absolute numeric difference; when two palindromes tie, pick the smaller one.

Only the value matters, not the spelling: candidates are built by mirroring a prefix. Also consider the powers-of-ten neighbors (`99..9` and `100..01`), which cover length changes the mirroring may miss.

**Example 1:**
```
Input: n = "123"
Output: "121"
Explanation: 121 and 131 are distance 2 away; the smaller wins.
```

**Example 2:**
```
Input: n = "1"
Output: "0"
Explanation: The nearest palindrome other than 1 itself is 0.
```

**Example 3:**
```
Input: n = "99"
Output: "101"
Explanation: 101 (distance 2) beats 88 (distance 11).
```

**Constraints:**
- `1 <= n.length <= 18`
- `n` has no leading zeros.
- `n` fits in a signed 64-bit integer.
