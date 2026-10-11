This is an offline adaptation of a streaming task. Instead of writing a class, you write one function that replays a whole session:

```
runMovingAverage(operations, args)
```

`operations[i]` is either `"MovingAverage"` (build the averager) or `"next"` (feed a value). `args[i]` holds the constructor or call argument: `args[0]` is `[size]` (the window width), and each later entry is `[value]` for that `next` call. Both arrays share the same length, and the first operation is always `"MovingAverage"`.

The averager remembers at most the newest `size` fed values. Each `next` appends its value (dropping the oldest when full) and yields the mean of the stored window as a decimal string (for example `"1.0"`, `"5.5"`).

Return the list of those decimal strings, one per `next` call, in order. Constructor steps contribute nothing to the output.

**Example 1:**
```
Input: operations = ["MovingAverage","next","next","next","next"], args = [[3],[1],[10],[3],[5]]
Output: ["1.0","5.5","4.666666666666667","6.0"]
Explanation: Windows are [1] (mean 1.0), [1,10] (mean 5.5), [1,10,3] (mean 14/3), [10,3,5] (mean 6.0).
```

**Example 2:**
```
Input: operations = ["MovingAverage","next","next"], args = [[1],[4],[5]]
Output: ["4.0","5.0"]
Explanation: Width 1 keeps only the newest value each time.
```

**Example 3:**
```
Input: operations = ["MovingAverage","next","next","next"], args = [[2],[-1],[3],[5]]
Output: ["-1.0","1.0","4.0"]
Explanation: Windows are [-1] (mean -1.0), [-1,3] (mean 1.0), [3,5] (mean 4.0).
```

**Constraints:**
- `1 <= size <= 1000`
- `-10^5 <= value <= 10^5`
- At most `10^4` `next` calls per session.

**Adaptation note:** The classic formulation uses a `MovingAverage` class with a `next` method returning `double`. Here averages are transported as decimal `string` values (compared with tolerance), and only `next` results are returned.
