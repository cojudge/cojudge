Return any value stored in a linked list, standing in for a uniform random pick.

You receive the head of a singly linked list with at least one node. Implement `getRandomNode(head)`, which returns the value of one node from the chain. The classic task additionally requires every node to be equally likely (usually via reservoir sampling) across repeated calls; this portable version calls the function once per test and accepts any value present in the list, so sampling fairness is not verified. Just make sure the returned integer actually occurs in the input chain.

**Example 1:**
```
Input: head = [1,2,3]
Output: 2
Explanation: Any of 1, 2, or 3 is accepted; 2 is one valid pick.
```

**Example 2:**
```
Input: head = [5]
Output: 5
Explanation: The lone value is the only valid answer.
```

**Example 3:**
```
Input: head = [1,2,2,3]
Output: 2
Explanation: Duplicates are fine; the answer only needs to appear in the list.
```

**Constraints:**
- `1 <= number of nodes <= 10^4`
- `-10^4 <= Node.val <= 10^4`
