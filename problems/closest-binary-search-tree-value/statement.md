Given the root of a binary search tree and a decimal `target` passed as a string (for example `"3.714286"`), return the tree value numerically closest to `target`.

This is a portable adaptation: parse `target` as a double and compare distances numerically. When two values are equally close, return the smaller one.

**Example 1:**
```
Input: root = [4,2,5,1,3], target = "3.714286"
Output: 4
Explanation: Distances are |4 - 3.714286| = 0.285714, |3 - 3.714286| = 0.714286 and larger for the rest, so 4 is closest.
```

**Example 2:**
```
Input: root = [1], target = "4.428571"
Output: 1
Explanation: The only value 1 is trivially the closest.
```

**Example 3:**
```
Input: root = [4,2,5,1,3], target = "3.5"
Output: 3
Explanation: 3 and 4 are both 0.5 away, and the tie goes to the smaller value 3.
```

**Constraints:**
- `1 <= number of nodes <= 10^4`
- `-10^4 <= Node.val <= 10^4`
- The tree is a valid binary search tree.
- `"-10^5" <= target <= "10^5"` as a decimal string parseable by a double.
