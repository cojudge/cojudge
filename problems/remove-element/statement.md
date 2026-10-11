You receive an integer array `nums` together with an integer `val`. Erase every occurrence of `val` directly inside `nums`; the surviving entries may finish in any order. Then report how many entries of `nums` differ from `val`.

Denote that survivor count by `k`. For acceptance, rearrange `nums` so its first `k` slots store exactly the entries that differ from `val`, and return `k`. Whatever sits past position `k` is irrelevant.

**Constraints:**

- 0 ≤ nums.length ≤ 100
- 0 ≤ nums[i] ≤ 50
- 0 ≤ val ≤ 100
