Raise duplicates just enough to make every entry different.

In one move you may pick any position and add one to its value. Repeating moves, turn the array into one with all distinct numbers while using as few moves as possible.

Given an integer array `nums`, return that smallest possible move count.

**Example 1:**
```
Input: nums = [1,2,2]
Output: 1
Explanation: Lift the second 2 to 3, giving [1,2,3] after a single move.
```

**Example 2:**
```
Input: nums = [3,2,1,2,1,7]
Output: 6
Explanation: One cheapest finish is [3,4,1,2,5,7]; reaching it costs 6 single-step raises.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `0 <= nums[i] <= 10^5`
- The answer fits in a 32-bit signed integer.
