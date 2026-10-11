Given a string mixing parentheses with other characters, delete the fewest parentheses
possible so that what remains is balanced (every opening bracket is closed in order).
Return every distinct result achievable with that minimum deletion count; the order of the
results does not matter. Non-parenthesis characters are never removed.

**Example 1:**
```
Input: s = "()())()"
Output: ["(())()","()()()"]
Explanation: Dropping one bracket suffices, and two balanced strings result.
```

**Example 2:**
```
Input: s = "(a)())()"
Output: ["(a())()","(a)()()"]
Explanation: The letter stays; one bracket must go, giving two options.
```

**Example 3:**
```
Input: s = ")("
Output: [""]
Explanation: Both brackets must go, leaving the empty string.
```

**Constraints:**
- `1 <= s.length <= 25`
- `s` holds lowercase letters plus `'('` and `')'`.
