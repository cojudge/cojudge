Group numbers that share a divisor larger than one and report the biggest group.

Picture each entry of `nums` as a node. Draw an edge between two nodes whenever their values share a common factor above 1 (for example 6 and 35 stay apart, while 6 and 10 connect through 2). Connected nodes form groups; lone numbers with no edges, such as 1 or an isolated prime, form groups of one.

Given distinct positive integers, return the size of the largest group.

**Constraints:**
- `1 <= nums.length <= 2 * 10^4`
- `1 <= nums[i] <= 10^5`
- All values in `nums` are distinct.
