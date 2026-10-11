You are given a string `s` made up only of the characters `'('` and `')'`. A substring is *valid* when its brackets pair up correctly (every closing bracket matches the most recent unmatched opening bracket, leaving nothing unmatched).

Return the length of the longest contiguous valid substring. When no pair exists anywhere, the answer is `0`.

**Example 1:**
```
Input: s = "(()"
Output: 2
Explanation: The substring "()" at the end is the longest valid block.
```

**Example 2:**
```
Input: s = ")()())"
Output: 4
Explanation: The block "()()" is valid and has length 4.
```

**Example 3:**
```
Input: s = ""
Output: 0
Explanation: An empty string contains no pairs.
```

**Constraints:**
- `0 <= s.length <= 3 * 10^4`
- Each character of `s` is `'('` or `')'`.
