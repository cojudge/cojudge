Given the head of a linked list `head`, in which each node contains an integer value.

Between every pair of adjacent nodes, insert a new node with a value equal to the greatest common divisor of them.

Return the linked list after insertion.

The greatest common divisor of two numbers is the largest positive integer that evenly divides both numbers.

**Examples:**

```
Input: head = [18,6,10,3]
Output: [18,6,6,2,10,1,3]
Explanation: gcd(18,6) = 6, gcd(6,10) = 2, gcd(10,3) = 1 are inserted between the adjacent nodes.
```

```
Input: head = [7]
Output: [7]
```

**Constraints:**

- The number of nodes in the list is in the range `[1, 5000]`.
- `1 <= Node.val <= 1000`