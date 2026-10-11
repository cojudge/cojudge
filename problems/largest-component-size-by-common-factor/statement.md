Group numbers that share a divisor larger than one and report the biggest group.

Picture each entry of `nums` as a node. Draw an edge between two nodes whenever their values share a common factor above 1 (for example 6 and 35 stay apart, while 6 and 10 connect through 2). Connected nodes form groups; lone numbers with no edges, such as 1 or an isolated prime, form groups of one.

Given distinct positive integers, return the size of the largest group.

**Example 1:**
```
Input: nums = [4,6,15,35]
Output: 4
Explanation: 4-6 share 2, 6-15 share 3, 15-35 share 5, chaining all four into one group.
```

**Example 2:**
```
Input: nums = [20,50,9,63]
Output: 2
Explanation: 20-50 join through 2 or 5, and 9-63 join through 3 or 9; the groups have size 2 each.
```

**Example 3:**
```
Input: nums = [2,3,6,7,4,12,21,39]
Output: 8
Explanation: Prime factors weave every number into a single group of eight.
```

**Constraints:**
- `1 <= nums.length <= 2 * 10^4`
- `1 <= nums[i] <= 10^5`
- All values in `nums` are distinct.
