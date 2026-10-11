You are given an integer array `nums` and an integer `k`. For each element you may pick a shift amount between `-k` and `k` (each element gets its own choice, and choosing `0` leaves it unchanged) and add it to that element.

After all shifts, the score is the difference between the largest and the smallest value. Return the smallest score you can achieve.

**Example 1:**
```
Input: nums = [1], k = 0
Output: 0
```

**Example 2:**
```
Input: nums = [0,10], k = 2
Output: 6
Explanation: Change 0 to 2 and 10 to 8. The spread is 8 - 2 = 6.
```

**Example 3:**
```
Input: nums = [1,3,6], k = 3
Output: 0
Explanation: Move every value to 4, giving a spread of 0.
```

**Constraints:**
- `1 <= nums.length <= 50`
- `0 <= nums[i] <= 10000`
- `0 <= k <= 10000`
