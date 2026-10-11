Run-length encoding squeezes a repetition-heavy sequence into pairs: for every even index `i`, `encoding[i]` says how many copies of `encoding[i+1]` appear next. As an illustration, `[3,8,2,5]` unfolds to `[8,8,8,5,5]`, and zeros may appear when a value is skipped.

An iterator walks that unfolded stream. Each `next(n)` call consumes the following `n` entries and reports the value of the last one consumed; when the stream runs dry the call reports `-1` instead.

To keep every language on one footing, this task batches the calls into a single function `runRle(encoding, operations, values)`. The `encoding` array is the paired list above, `operations[i]` names the call (always `"next"` here), `values[i]` holds the `n` for that call, and the returned array holds each call's answer in order.

**Example 1:**
```
Input: encoding = [3,8,0,9,2,5], operations = ["next","next","next","next"], values = [2,1,1,2]
Output: [8,8,5,-1]
Explanation: The stream is [8,8,8,5,5]. Consuming 2 gives 8, one more gives 8, one more skips the zero-count 9 and gives 5, and asking for 2 with one item left gives -1.
```

**Example 2:**
```
Input: encoding = [1,5], operations = ["next","next"], values = [1,1]
Output: [5,-1]
Explanation: The stream holds a lone 5; the first call reports it and the second finds nothing.
```

**Example 3:**
```
Input: encoding = [0,1,2,2], operations = ["next","next"], values = [1,2]
Output: [2,2]
Explanation: The leading zero-count entry is skipped, leaving [2,2].
```

**Constraints:**
- `2 <= encoding.length <= 1000`
- `encoding.length` is even.
- `0 <= encoding[i] <= 10^9`
- `1 <= n <= 10^9` for each `next` call.
- At most `1000` calls are made.

> **Adaptation note:** the original LeetCode shape is a class `RLEIterator` with a constructor plus `next(n)`. Here the constructor argument and the sequence of `next` arguments are supplied together to `runRle`, which returns the list of `next` results. Grading compares the integer arrays exactly.
