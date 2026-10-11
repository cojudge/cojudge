Add one to a number stored digit-by-digit in forward order in a linked list.

Each node of the singly linked list holds one decimal digit, with the most significant digit at the head. Interpret the whole chain as a non-negative integer without leading zeros (except the single digit `0` itself) and return the head of the list that represents the value plus one. The length may grow by one digit when every digit rolls over, for example `[9,9]` becoming `[1,0,0]`.

**Example 1:**
```
Input: head = [1,2,3]
Output: [1,2,4]
Explanation: 123 plus 1 is 124.
```

**Example 2:**
```
Input: head = [9,9]
Output: [1,0,0]
Explanation: 99 plus 1 is 100, needing one extra node.
```

**Example 3:**
```
Input: head = [0]
Output: [1]
Explanation: 0 plus 1 is 1.
```

**Constraints:**
- `1 <= number of nodes <= 100`
- `0 <= Node.val <= 9`
- The digits contain no leading zeros except the number zero itself.
