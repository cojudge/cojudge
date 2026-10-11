Check whether two edited texts end up identical.

Each input holds lowercase letters plus the symbol `#`, which erases the most recent not-yet-erased letter before it (like a backspace key). If no letter exists, the eraser does nothing. Build the final text of `s` and of `t` under these rules and return `true` when both results match.

**Example 1:**
```
Input: s = "ab#c", t = "ad#c"
Output: true
Explanation: Both reduce to "ac": the middle letter is erased in each.
```

**Example 2:**
```
Input: s = "ab##", t = "c#d#"
Output: true
Explanation: Both reduce to the empty string.
```

**Example 3:**
```
Input: s = "a#c", t = "b"
Output: false
Explanation: The first becomes "c" while the second stays "b".
```

**Constraints:**
- `1 <= s.length, t.length <= 200`
- Strings hold lowercase letters and `#`.
