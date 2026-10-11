Build a singly linked list that supports indexed access and edits. Instead of submitting a class, you write one runner function `runLinkedList(operations, args)` that replays a script and returns every `get` result in order.

The script uses parallel arrays: `operations[i]` names the action and `args[i]` holds its numbers.
- `"MyLinkedList"` with `[]` restarts with an empty list.
- `"get"` with `[index]` reads the value at `index`, or `-1` when invalid.
- `"addAtHead"` with `[val]` inserts before the first element.
- `"addAtTail"` with `[val]` appends at the end.
- `"addAtIndex"` with `[index,val]` inserts before position `index`; if `index` equals the length it appends; if `index` is larger than the length nothing happens; a non-positive index inserts at the head.
- `"deleteAtIndex"` with `[index]` removes the element there when valid.

Return an array containing the `get` answers in the order they were issued.

This is a portable adaptation: the original class with five methods becomes a single `runXxx` function, mirroring other design adaptations in this judge.

**Example 1:**
```
Input: operations = ["MyLinkedList","addAtHead","addAtTail","addAtIndex","get","deleteAtIndex","get"], args = [[],[1],[3],[1,2],[1],[1],[1]]
Output: [2,3]
Explanation: The list grows 1, then [1,3], then [1,2,3]. Reading index 1 gives 2; deleting index 1 leaves [1,3], so the next read gives 3.
```

**Example 2:**
```
Input: operations = ["MyLinkedList","addAtHead","get"], args = [[],[5],[0]]
Output: [5]
Explanation: One insertion followed by a valid read.
```

**Example 3:**
```
Input: operations = ["MyLinkedList","get","addAtIndex","get"], args = [[],[0],[5,10],[0]]
Output: [-1,-1]
Explanation: Reading an empty list fails; inserting beyond the length is ignored, so the second read also fails.
```

**Constraints:**
- `1 <= operations.length <= 2000`
- `0 <= index, val <= 1000`
- `args[i]` lengths match the operation arities above.
