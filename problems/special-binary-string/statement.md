A binary string is called *balanced* when it holds equally many `1`s and `0`s and every prefix contains at least as many `1`s as `0`s.

You are given a balanced string `s`. One move picks two neighboring non-empty balanced blocks that sit directly next to each other inside `s` and exchanges their order. After any number of such moves, return the lexicographically greatest string you can obtain (`1` sorts after `0`).

**Constraints:**
- `1 <= s.length <= 50`
- `s[i]` is `'0'` or `'1'`
- `s` is balanced
