A row of `n` washing machines holds `machines[i]` garments each. In one move, any number of machines may each hand a single garment to a neighboring machine (left or right). The goal is an even split where every machine ends with the same count.

Return the smallest number of moves that achieves the split, or `-1` when the total garment count is not divisible by `n` and sharing is therefore impossible.

**Example 1:**
```
Input: machines = [1,0,5]
Output: 3
Explanation: The average is 2. The left machine needs 1 more and the right one must give 3 away; balancing takes 3 moves.
```

**Example 2:**
```
Input: machines = [0,3,0]
Output: 2
Explanation: The average is 1. Both outer machines pull one garment from the middle, finishing in 2 moves.
```

**Example 3:**
```
Input: machines = [0,2,0]
Output: -1
Explanation: The total 2 cannot be split evenly across 3 machines.
```

**Constraints:**
- `1 <= machines.length <= 10^4`
- `0 <= machines[i] <= 10^5`
