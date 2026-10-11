Given a string `s` and a target letter `c`, compute for every index the distance to the closest occurrence of `c` in `s`. The target is guaranteed to appear at least once.

Adaptation note: the original signature takes a `char`, which has no portable equivalent across all eight judges. Here `c` is a one-character string; implementations should read its first character.

**Example 1:**
```
Input: s = "loveleetcode", c = "e"
Output: [3,2,1,0,1,0,0,1,2,2,1,0]
Explanation: Positions holding e report 0; others report steps to the nearest e.
```

**Example 2:**
```
Input: s = "aaab", c = "b"
Output: [3,2,1,0]
Explanation: Only the last cell matches, so distances count down to it.
```

**Example 3:**
```
Input: s = "ab", c = "a"
Output: [0,1]
Explanation: The opening cell is the target.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` and `c` consist of lowercase English letters.
- `c` has length 1 and occurs in `s`.
