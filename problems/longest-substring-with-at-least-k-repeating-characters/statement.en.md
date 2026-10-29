For a lowercase string `s` and a threshold `k`, consider every contiguous block of `s`. A block counts as *good* when each distinct letter inside it occurs at least `k` times within that block (letters absent from the block are ignored). Return the length of the longest good block, or `0` when no good block exists.

Note that a good block need not use the whole string: rare letters can be skipped by cutting around them.

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` contains only lowercase English letters.
- `1 <= k <= 10^5`
