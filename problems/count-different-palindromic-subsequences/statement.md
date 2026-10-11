A subsequence keeps some of the characters of a string in their original order while dropping the rest. Two subsequences count as the same whenever their letter sequences match, even if they were formed from different positions.

Given a string `s` built only from the letters `a`, `b`, `c` and `d`, count how many distinct non-empty subsequences of `s` read the same forwards and backwards. Because the total can be huge, return it modulo `1,000,000,007`.

**Constraints:**
- `1 <= s.length <= 1000`
- `s` holds only `a`, `b`, `c`, `d`.
