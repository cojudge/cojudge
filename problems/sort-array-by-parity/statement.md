Reorder `nums` so that every even entry comes before every odd entry. The relative order inside the even block and inside the odd block does not matter — any arrangement with all evens first is accepted.

**Example 1:**
```
Input: nums = [3,1,2,4]
Output: [2,4,3,1]
Explanation: Evens [2,4] lead and odds [3,1] follow; other splits such as [4,2,1,3] are equally fine.
```

**Example 2:**
```
Input: nums = [0]
Output: [0]
Explanation: A lone even is already placed.
```

**Example 3:**
```
Input: nums = [1,3,5,2,4]
Output: [2,4,1,3,5]
Explanation: The two evens move ahead in any order.
```

**Constraints:**
- `1 <= nums.length <= 5000`
- `0 <= nums[i] <= 5000`

> **Grading note:** outputs are checked by multiset equality plus the evens-first property, not by exact sequence match.
