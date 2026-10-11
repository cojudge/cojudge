Call the XOR-combination of a list the result of XOR-ing all of its entries together, with the empty list assigned `0`.

- As an illustration, the XOR-combination of `[2,5,6]` is `2 XOR 5 XOR 6 = 1`.

Starting from an input list `nums`, consider each of its subsets and compute that subset's XOR-combination. Return the total obtained by adding all of those values together.

**Note:** Selections that look alike but arise from different positions count separately.

Here a subset means any collection obtainable from `b` by discarding zero or more entries, keeping the rest, when written as `a` drawn from `b`.

**Constraints:**

- `1 <= nums.length <= 12`
- `1 <= nums[i] <= 20`
