You are given an integer array `nums` and two non-negative limits `indexDiff` and `valueDiff`. Decide whether there exist two different positions `i` and `j` such that the positions are close and the values are close at the same time:

- `abs(i - j) <= indexDiff`, and
- `abs(nums[i] - nums[j]) <= valueDiff`.

**Example 1:**
```
Input: nums = [1,2,3,1], indexDiff = 3, valueDiff = 0
Output: true
Explanation: Positions 0 and 3 hold the same value 1; |0-3| = 3 <= 3 and |1-1| = 0 <= 0.
```

**Example 2:**
```
Input: nums = [1,5,9,1,5,9], indexDiff = 2, valueDiff = 3
Output: false
Explanation: Equal values sit 3 apart (too far), and every pair within distance 2 differs by 4 or more.
```

**Example 3:**
```
Input: nums = [1,2,1,1], indexDiff = 1, valueDiff = 0
Output: true
Explanation: Positions 2 and 3 both hold 1 with |2-3| = 1 <= 1.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `0 <= indexDiff <= 10^5`
- `0 <= valueDiff <= 2^31 - 1`
