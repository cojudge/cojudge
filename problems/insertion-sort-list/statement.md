Sort a singly linked list using insertion sort and return the head of the ordered list.

Insertion sort builds the answer one element at a time: take the next input node, find where it belongs among the already sorted prefix, and splice it in. Repeat until no input nodes remain.

**Example 1:**
```
Input: head = [4,2,1,3]
Output: [1,2,3,4]
Explanation: Inserting 2 before 4, then 1 at the front, then 3 before 4 gives sorted order.
```

**Example 2:**
```
Input: head = [-1,5,3,4,0]
Output: [-1,0,3,4,5]
Explanation: Each value is relocated into the growing sorted prefix.
```

**Constraints:**
- The list holds between 1 and 5000 nodes.
- `-5000 <= Node.val <= 5000`
