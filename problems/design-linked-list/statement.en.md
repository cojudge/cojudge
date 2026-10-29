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

**Constraints:**
- `1 <= operations.length <= 2000`
- `0 <= index, val <= 1000`
- `args[i]` lengths match the operation arities above.
