Call the XOR-combination of a list the result of XOR-ing all of its entries together, with the empty list assigned `0`.

- As an illustration, the XOR-combination of `[2,5,6]` is `2 XOR 5 XOR 6 = 1`.

Starting from an input list `nums`, consider each of its subsets and compute that subset's XOR-combination. Return the total obtained by adding all of those values together.

**Note:** Selections that look alike but arise from different positions count separately.

Here a subset means any collection obtainable from `b` by discarding zero or more entries, keeping the rest, when written as `a` drawn from `b`.

**Example 1:**

```
Input: nums = [1,3]
Output: 6
Explanation: The 4 subsets of [1,3] are:
- []: XOR total = 0
- [1]: XOR total = 1
- [3]: XOR total = 3
- [1,3]: XOR total = 1 XOR 3 = 2
0 + 1 + 3 + 2 = 6
```

**Example 2:**

```
Input: nums = [5,1,6]
Output: 28
Explanation: The 8 subsets of [5,1,6] are:
- []: XOR total = 0
- [5]: XOR total = 5
- [1]: XOR total = 1
- [6]: XOR total = 6
- [5,1]: XOR total = 5 XOR 1 = 4
- [5,6]: XOR total = 5 XOR 6 = 3
- [1,6]: XOR total = 1 XOR 6 = 7
- [5,1,6]: XOR total = 5 XOR 1 XOR 6 = 2
0 + 5 + 1 + 6 + 4 + 3 + 7 + 2 = 28
```

**Example 3:**

```
Input: nums = [3,4,5,6,7,8]
Output: 480
Explanation: Adding the XOR total of every subset gives 480.
```

**Constraints:**

- `1 <= nums.length <= 12`
- `1 <= nums[i] <= 20`
