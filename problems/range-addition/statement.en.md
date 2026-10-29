Rebuild the final array after many interval increments.

Start with an array of `length` zeros. Each entry of `updates` is a triple `[start, end, inc]` meaning add `inc` to every position from `start` through `end` inclusive. Apply all triples in order and return the resulting array. When `updates` is empty the answer is all zeros; when `length` is zero the answer is the empty array.

**Constraints:**
- `0 <= length <= 10^4`
- `0 <= updates.length <= 10^4`
- Each triple has the form `[start, end, inc]` with `0 <= start <= end < length` when `length > 0`.
- `-1000 <= inc <= 1000`
