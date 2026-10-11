You are given a binary array `arr`. Split it into three non-empty consecutive blocks so that each block represents the same binary value (leading zeros are ignored).

Return indices `[i, j]` where the first block is `arr[0..i]`, the second is `arr[i+1..j-1]`, and the third is `arr[j..n-1]`. When no such split exists, return `[-1, -1]`. When several splits work (for example an all-zero array), any valid one is accepted.

**Constraints:**
- `3 <= arr.length <= 30000`
- Each entry is `0` or `1`.

Adaptation: the returned pair uses `int_array`; the checker accepts any valid split, not only the reference one.
