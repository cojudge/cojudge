Design a circular queue (ring buffer) with a fixed capacity.

`operations[0]` is always `MyCircularQueue` and `values[0]` is the capacity
`k`. For `i >= 1`, `operations[i]` is one of `enQueue`, `deQueue`, `Front`,
`Rear`, `isEmpty`, or `isFull`. `values[i]` is used only by `enQueue`;
otherwise it is ignored. Return an array with one entry per operation after
the constructor: `enQueue`/`deQueue`/`isEmpty`/`isFull` return `1` for true
and `0` for false, while `Front`/`Rear` return the element or `-1` when the
queue is empty.

**Constraints:**

- `1 <= k <= 1000`
- `0 <= value <= 1000`
- At most 3000 calls are made in one trace.
