You are given a string `s` built from lowercase English letters. Delete some characters so that each distinct letter occurring in `s` shows up exactly once in what remains, while the surviving characters keep their original relative order.

Among every string achievable this way, pick the one that comes first in dictionary (lexicographical) order and return it.

**Example 1:**
```
Input: s = "bcabc"
Output: "abc"
Explanation: Keeping one of each of 'a', 'b' and 'c' allows "abc", "bac" or "bca"; "abc" is the smallest of these.
```

**Example 2:**
```
Input: s = "cbacdcbc"
Output: "acdb"
Explanation: The distinct letters are 'a', 'b', 'c' and 'd', and "acdb" is the smallest ordering obtainable as a subsequence.
```

**Example 3:**
```
Input: s = "abacb"
Output: "abc"
Explanation: "abc" can be formed (for instance from positions 0, 1 and 4) and no smaller arrangement of 'a', 'b', 'c' is a subsequence.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` consists of lowercase English letters.
