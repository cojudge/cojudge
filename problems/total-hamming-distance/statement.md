The *gap* between two integers is the number of bit slots where their binary forms differ. Given an array `nums`, add up that gap over every unordered pair of positions.

Return the total sum.

**Example 1:**

```
Input: nums = [4,14,2]
Output: 6
Explanation: Pair gaps are 2 + 2 + 2 = 6 when each number is viewed with
enough leading zeroes to align them.
```

**Example 2:**

```
Input: nums = [4,14,4]
Output: 4
Explanation: The two 4s differ in 0 slots; each differs from 14 in 2 slots.
```

**Example 3:**

```
Input: nums = [1,2,3]
Output: 4
Explanation: Gaps are 2 + 1 + 1 = 4.
```

**Constraints:**

- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^9`
- The total fits in a signed 32-bit integer.
