A password is strong when all of these hold: it spans `6` to `20` characters, it contains at least one lowercase letter, one uppercase letter and one digit, and no three identical characters sit consecutively.

In one step you may insert a character anywhere, delete a character, or replace a character with another. Given `password`, return the smallest number of steps that makes it strong (zero when it already qualifies).

Passwords hold letters, digits, `.` and `!`.

**Example 1:**
```
Input: password = "a"
Output: 5
Explanation: Five insertions grow the length to 6 while adding the missing upper-case and digit classes.
```

**Example 2:**
```
Input: password = "aA1"
Output: 3
Explanation: Types are fine; three insertions reach the minimum length.
```

**Example 3:**
```
Input: password = "1337C0d3"
Output: 0
Explanation: All length, variety and repeat conditions already hold.
```

**Constraints:**
- `1 <= password.length <= 50`
- Characters are letters, digits, `.` or `!`.
