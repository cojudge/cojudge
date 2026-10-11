Scan a lowercase word and locate the earliest position whose letter appears nowhere else in the word. Return that zero-based position. When every letter repeats, return `-1`.

The scan must distinguish the *first* singleton by its left-to-right order, not the smallest letter alphabetically.

**Example 1:**
```
Input: s = "leetcode"
Output: 0
Explanation: 'l' occurs once and stands at index 0; 'e' repeats, so index 0 wins.
```

**Example 2:**
```
Input: s = "loveleetcode"
Output: 2
Explanation: 'l', 'o' and 'e' all repeat. The first letter with a single
occurrence is 'v' at index 2.
```

**Example 3:**
```
Input: s = "aabb"
Output: -1
Explanation: Both 'a' and 'b' appear twice, so there is no singleton.
```

**Constraints:**
- `1 <= s.length <= 10^5`
- `s` contains only lowercase English letters.
