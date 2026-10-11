You are given a list `nums` with `n` entries. Every value lies between `1` and `n`. Each number shows up once or twice; some values show up twice and the rest show up once.

Collect every value that shows up twice and return them.

The order of the returned values does not matter.

> **Adaptation note:** the original LeetCode return type is `List<Integer>`; this problem uses the portable `int_list` output type with the same values.

**Example 1:**
```
Input: nums = [4,3,2,7,8,2,3,1]
Output: [2,3]
Explanation: Values 2 and 3 each occur twice; the rest occur once.
```

**Example 2:**
```
Input: nums = [1,1,2]
Output: [1]
Explanation: Only 1 repeats.
```

**Example 3:**
```
Input: nums = [1]
Output: []
Explanation: Nothing repeats.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= nums.length`
