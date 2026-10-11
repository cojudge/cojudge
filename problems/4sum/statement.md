You receive an array `nums` of `n` integers plus an integer `target`. Gather every quadruplet of values `[nums[a], nums[b], nums[c], nums[d]]` picked from four pairwise-distinct positions:

- each index satisfies 0 ≤ a, b, c, d < n
- the four indices are all different from one another
- the four chosen elements add up to exactly `target`: nums[a] + nums[b] + nums[c] + nums[d] == target

The collected quadruplets may come back in any order.

**Constraints:**

- 1 ≤ nums.length ≤ 200
- -10^9 ≤ nums[i] ≤ 10^9
- -10^9 ≤ target ≤ 10^9
