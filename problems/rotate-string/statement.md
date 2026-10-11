You are given two strings `s` and `goal`. One rotation step moves the leftmost character of the string to its far right end, preserving the order of all other characters.

Decide whether any number of such steps (possibly zero) can turn `s` into `goal`.

**Example 1:**
```
Input: s = "abcde", goal = "cdeab"
Output: true
Explanation: Two left rotations give "cdeab".
```

**Example 2:**
```
Input: s = "abcde", goal = "abced"
Output: false
Explanation: No rotation of "abcde" equals "abced".
```

**Example 3:**
```
Input: s = "a", goal = "a"
Output: true
Explanation: Zero rotations already match.
```

**Constraints:**
- `1 <= s.length, goal.length <= 100`
- Both strings contain only lowercase English letters
