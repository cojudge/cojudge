For any non-empty collection of numbers, look at the gap between its biggest entry and its tiniest entry. A lone element therefore has a gap of zero.

You are handed an integer array `nums`. Think about every subsequence you can build by keeping some elements and dropping the rest while preserving their relative order (the kept elements need not sit next to each other). Add up the gap of each such subsequence, then give the total modulo `10^9 + 7`.

**Example 1:**
```
Input: nums = [2,1,3]
Output: 6
Explanation: The lone-element groups [1], [2], [3] each contribute 0. The pairs contribute 1 + 1 + 2 = 4 and the triple [2,1,3] contributes 2, for 6 in total.
```

**Example 2:**
```
Input: nums = [2]
Output: 0
Explanation: There is only one non-empty subsequence and its gap is 0.
```

**Example 3:**
```
Input: nums = [1,2,3,4]
Output: 23
Explanation: After sorting, each value acts as a maximum for some subsequences and as a minimum for others; combining those counts yields 23.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^5`
