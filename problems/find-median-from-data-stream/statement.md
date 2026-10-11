The **median** of a sorted integer collection is its central entry. When the collection holds an even count, the median becomes the average of the two central entries.

Build a structure that tracks this value as numbers arrive one by one:

- `MedianFinder()` creates a fresh `MedianFinder` tracker.
- `void addNum(int num)` feeds one integer `num` from the stream into the tracker.
- `double findMedian()` reports the median of everything fed in so far. Outputs landing within `10^-5` of the true median count as correct.

**Constraints:**
- `-10^5 <= num <= 10^5`
- The tracker will hold at least one entry whenever `findMedian` is invoked.
- No more than `5 * 10^4` invocations of `addNum` and `findMedian` combined will occur.
