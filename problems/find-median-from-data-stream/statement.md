The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values.

- Implement the `MedianFinder` class:
  - `MedianFinder()` initializes the `MedianFinder` object.
  - `void addNum(int num)` adds the integer `num` from the data stream to the data structure.
  - `double findMedian()` returns the median of all elements so far. Answers within `10^-5` of the actual answer will be accepted.

**Example 1:**
```
Input:
["MedianFinder","addNum","findMedian","addNum","findMedian"]
[[],[1],[],[2],[]]
Output: [null,null,1.0,null,1.5]
Explanation: After adding 1, the median is 1.0. After adding 2, the median is 1.5.
```

**Example 2:**
```
Input:
["MedianFinder","addNum","addNum","addNum","addNum","findMedian"]
[[],[1],[2],[3],[4],[]]
Output: [null,null,null,null,null,2.5]
Explanation: After adding [1,2,3,4], the sorted list is [1,2,3,4] and the median is (2+3)/2 = 2.5.
```

**Constraints:**
- `-10^5 <= num <= 10^5`
- There will be at least one element in the data structure before calling `findMedian`.
- At most `5 * 10^4` calls will be made to `addNum` and `findMedian`.
