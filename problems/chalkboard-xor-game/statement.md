Numbers are written on a board. Two players alternate erasing one number at a time. The player who makes the xor of the remaining numbers equal 0 wins immediately; if every number is erased without that happening, the last player to move is declared the winner.

Both players play perfectly and the first player moves first. Given the starting list `nums`, decide whether the first player can force a win.

In other words, work out the xor of the whole list and look at its length: a zero xor is an instant win, otherwise an even length still lets the first player force a win while an odd length does not.

**Example 1:**
```
Input: nums = [1,1,2]
Output: false
Explanation: The combined xor is nonzero and the length is odd, so the second player wins with perfect play.
```

**Example 2:**
```
Input: nums = [0,1]
Output: true
Explanation: The length is even, which gives the first player a forced win despite the nonzero xor.
```

**Example 3:**
```
Input: nums = [1,2,3]
Output: true
Explanation: 1 xor 2 xor 3 is 0, so the starting position is already winning for the first player.
```

**Constraints:**
- `1 <= nums.length <= 1000`
- `0 <= nums[i] < 2^16`
