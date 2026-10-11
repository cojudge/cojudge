You are given the head of a singly linked list. Positions are numbered starting from 1, so the first node is odd, the second is even, and so on. Rearrange the list so that all odd-positioned nodes come first, followed by all even-positioned nodes, keeping the original relative order inside each group. Return the head of the reordered list.

Do this in linear time using only a constant amount of extra space (apart from rewiring pointers).

**Example 1:**
```
Input: head = [1,2,3,4,5]
Output: [1,3,5,2,4]
Explanation: Odd positions hold 1, 3, 5 and even positions hold 2, 4.
```

**Example 2:**
```
Input: head = [2,1,3,5,6,4,7]
Output: [2,3,6,7,1,5,4]
Explanation: Odd positions hold 2, 3, 6, 7 and even positions hold 1, 5, 4.
```

**Example 3:**
```
Input: head = []
Output: []
Explanation: An empty list reorders to itself.
```

**Constraints:**
- The number of nodes lies in `[0, 10^4]`.
- `-10^6 <= Node.val <= 10^6`
