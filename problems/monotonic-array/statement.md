Call a list steadily rising when every later entry is at least as large as every earlier one, and steadily falling when every later entry is at most as large as every earlier one. A list that satisfies either pattern (including flat lists where all entries tie) counts as monotone.

Given `nums`, decide whether it is monotone in either direction.

**Example 1:**
```
Input: nums = [1,2,2,3]
Output: true
Explanation: Each step stays the same or climbs, so the rising pattern holds.
```

**Example 2:**
```
Input: nums = [6,5,4,4]
Output: true
Explanation: Each step stays the same or drops, so the falling pattern holds.
```

**Example 3:**
```
Input: nums = [1,3,2]
Output: false
Explanation: The list climbs then dips, breaking both patterns.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-10^5 <= nums[i] <= 10^5`
