Given a string `s`, find the length of the longest piece that uses no more than two different characters.

Think of scanning from left to right while keeping track of the characters inside the current window. When a third distinct character appears, shrink the window from the left until only two distinct characters remain. The best window size seen during this scan is the answer.

**Constraints:**
- `0 <= s.length <= 10^4`
- `s` consists of lowercase and uppercase English letters
