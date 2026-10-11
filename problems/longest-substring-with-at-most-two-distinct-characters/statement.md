Given a string `s`, find the length of the longest piece that uses no more than two different characters.

Think of scanning from left to right while keeping track of the characters inside the current window. When a third distinct character appears, shrink the window from the left until only two distinct characters remain. The best window size seen during this scan is the answer.

**Example 1:**
```
Input: s = "eceba"
Output: 3
Explanation: The longest piece using at most two distinct characters is "ece".
```

**Example 2:**
```
Input: s = "ccaabbb"
Output: 5
Explanation: The longest piece using at most two distinct characters is "aabbb".
```

**Example 3:**
```
Input: s = "a"
Output: 1
Explanation: A single character trivially uses one distinct character.
```

**Constraints:**
- `0 <= s.length <= 10^4`
- `s` consists of lowercase and uppercase English letters
