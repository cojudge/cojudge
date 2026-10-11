You are given an integer array `nums`. For every position `i`, count how many elements strictly smaller than `nums[i]` appear to its right (at indices greater than `i`). Collect these counts into an array of the same length and return it.

*Adaptation note:* the original statement returns a list of integers; here the result is returned as a plain integer array with identical contents and order.

**Example 1:**
```
Input: nums = [5,2,6,1]
Output: [2,1,1,0]
Explanation: Right of 5 sit the smaller values 2 and 1; right of 2 sits 1; right of 6 sits 1; right of 1 sits nothing.
```

**Example 2:**
```
Input: nums = [-1]
Output: [0]
Explanation: A lone element has nothing to its right.
```

**Example 3:**
```
Input: nums = [-1,-1]
Output: [0,0]
Explanation: Neither entry is strictly smaller than the other.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
