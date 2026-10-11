Given the head of a linked list and a threshold `x`, reorder the nodes so that all values smaller than `x` appear before all values greater than or equal to `x`. The original relative order inside each of the two groups must be preserved.

Only the links change; no new values are created. Return the head of the reordered list.

**Example 1:**
```
Input: head = [1,4,3,2,5,2], x = 3
Output: [1,2,2,4,3,5]
Explanation: Values 1, 2, 2 stay in order up front, followed by 4, 3, 5 in order.
```

**Example 2:**
```
Input: head = [2,1], x = 2
Output: [1,2]
Explanation: The smaller value 1 moves ahead of 2.
```

**Example 3:**
```
Input: head = [], x = 1
Output: []
Explanation: An empty list stays empty.
```

**Constraints:**
- `0 <= number of nodes <= 200`
- `-100 <= node value <= 100`
- `-200 <= x <= 200`
