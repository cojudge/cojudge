Decide whether two strings are exactly one edit apart. A single edit means inserting one character, deleting one character, or replacing one character.

The strings must differ by precisely one such step. Identical strings need zero edits, so they do not count; strings that need two or more steps also do not count.

**Example 1:**
```
Input: s = "ab", t = "acb"
Output: true
Explanation: Inserting "c" between "a" and "b" turns "ab" into "acb".
```

**Example 2:**
```
Input: s = "cab", t = "ad"
Output: false
Explanation: More than one insertion, deletion, or replacement is needed.
```

**Example 3:**
```
Input: s = "1203", t = "1213"
Output: true
Explanation: Replacing "0" with "1" makes the strings equal.
```

**Constraints:**
- `0 <= s.length, t.length <= 10^4`
- Strings consist of letters and digits.
