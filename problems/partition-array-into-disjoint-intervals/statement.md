You are given an integer array `nums`. Cut it into two non-empty contiguous pieces, a left piece and a right piece, such that every value in the left piece is less than or equal to every value in the right piece.

Return the smallest possible length of the left piece. Every test input admits at least one such cut.

**Example 1:**
```
Input: nums = [5,0,3,8,6]
Output: 3
Explanation: The left piece [5,0,3] has maximum 5 and the right piece [8,6] has minimum 6.
```

**Example 2:**
```
Input: nums = [1,1,1,0,6,12]
Output: 4
Explanation: The left piece [1,1,1,0] has maximum 1 and the right piece [6,12] has minimum 6.
```

**Example 3:**
```
Input: nums = [1,2,3,4,5]
Output: 1
```

**Constraints:**
- `2 <= nums.length <= 30000`
- `0 <= nums[i] <= 10^6`
