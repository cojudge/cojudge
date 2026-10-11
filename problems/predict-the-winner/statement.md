Two opponents alternately remove one number from either tip of an array `nums`, adding it to their own total. The first player moves first, and both sides play perfectly to maximize their own final total. A drawn total still counts as a first-player success.

Decide whether the first player can finish with at least as many points as the second.

**Example 1:**

```
Input: nums = [1,5,2]
Output: false
Explanation: First player picks 1 or 2; second then secures 5 and wins
4 to 2 or 5 to 3 (second player takes the larger remainder).
```

**Example 2:**

```
Input: nums = [1,5,233,7]
Output: true
Explanation: Opening with 1 lets the first player later claim 233 and
win 234 to 12.
```

**Example 3:**

```
Input: nums = [1]
Output: true
Explanation: Single pick wins immediately.
```

**Constraints:**

- `1 <= nums.length <= 20`
- `0 <= nums[i] <= 10^7`
