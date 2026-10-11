For every node of a binary tree, consider the sum of all values in the subtree rooted at that node (the node itself plus everything below it). Collect one such total per node, count how many times each distinct total appears, and return every total that attains the highest frequency. The order of the returned totals does not matter.

**Example 1:**
```
Input: root = [5,2,-3]
Output: [2,-3,4]
Explanation: The three subtree totals are 2 (left leaf), -3 (right leaf) and 4 (whole tree); each occurs once, so all are returned.
```

**Example 2:**
```
Input: root = [5,2,-5]
Output: [2]
Explanation: The subtree totals are 2, -5 and 2; the value 2 occurs twice, more than any other total.
```

**Example 3:**
```
Input: root = [1]
Output: [1]
Explanation: The only subtree total is 1.
```

**Constraints:**
- The number of nodes is in the range `[0, 10^4]`
- `-10^5 <= Node.val <= 10^5`
