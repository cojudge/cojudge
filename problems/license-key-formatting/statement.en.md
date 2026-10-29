A license key is written as letters, digits, and dashes. Reformat it in this way: drop every dash, turn lowercase letters into uppercase, then re-insert dashes so that each chunk holds exactly `k` characters, except the leading chunk which may be shorter but must not be empty. Dashes separate chunks and never appear at the ends.

Return the reformatted key.

**Constraints:**

- `1 <= s.length <= 10^5`
- `s` holds English letters, digits, and `-`.
- `1 <= k <= 10^4`
