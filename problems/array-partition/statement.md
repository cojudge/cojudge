Given an integer array `nums` containing an even number of elements, split it into pairs so that the sum of the smaller element of each pair is as large as possible, and return that maximum sum.

Pairing two numbers contributes the lesser of the two. To push the total upward, small values should be sacrificed together so that larger values survive as the kept minimum of their pairs.

**Example 1:**
```
Input: nums = [1,4,3,2]
Output: 4
Explanation: Pairs (1,2) and (3,4) contribute 1 + 3 = 4, which is optimal.
```

**Example 2:**
```
Input: nums = [6,2,6,5,1,2]
Output: 9
Explanation: Pairs (1,2), (2,5) and (6,6) contribute 1 + 2 + 6 = 9.
```

**Example 3:**
```
Input: nums = [1,2]
Output: 1
Explanation: The only pair contributes min(1,2) = 1.
```

**Constraints:**
- `2 <= nums.length <= 2 * 10^4`, and the length is even.
- `-10^4 <= nums[i] <= 10^4`
