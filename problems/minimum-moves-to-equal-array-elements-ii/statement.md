You are given an integer array `nums`. In one move you may increment or decrement a single element by 1.

Return the smallest number of moves needed to make all elements equal.

**Example 1:**
```
Input: nums = [1,2,3]
Output: 2
Explanation: Equalize at 2: one move raises 1 to 2 and one move lowers 3 to 2.
```

**Example 2:**
```
Input: nums = [1,10,2,9]
Output: 16
Explanation: Equalizing at any value between 2 and 9 costs 16 moves; for example target 5 needs 4 + 5 + 3 + 4 moves.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
