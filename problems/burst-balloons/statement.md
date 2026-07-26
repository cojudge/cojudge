You are given an array `nums` of non-negative integers representing balloons. If you burst balloon `i`, you gain `nums[i - 1] * nums[i] * nums[i + 1]` coins. After the balloon is burst, its two neighbors become adjacent.

Treat positions outside the current array as balloons with value `1`. Return the maximum number of coins you can collect by bursting every balloon.

**Constraints:**

- `1 <= nums.length <= 300`
- `0 <= nums[i] <= 100`
- The maximum coin total fits in a signed 32-bit integer.
