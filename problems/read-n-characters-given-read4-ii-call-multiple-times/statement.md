You are given a file's full text `file` and a sequence of request sizes `queries`. Imagine calling a `read(n)` routine several times in a row, where each call uses `read4` internally, keeps any leftover characters buffered between calls, and continues from where the previous call stopped.

Simulate all calls at once: for each `queries[i]`, collect up to that many characters from the current file position (using leftover buffered data first), advance the position, and store the chunk.

Return the list of collected chunks, one per query.

**Example 1:**
```
Input: file = "abc", queries = [1,2,1]
Output: ["a","bc",""]
Explanation: First call takes "a", second takes "bc", and the third finds nothing left.
```

**Example 2:**
```
Input: file = "abc", queries = [4,1]
Output: ["abc",""]
Explanation: The first call drains the file; the second returns empty.
```

**Constraints:**
- `0 <= file.length <= 10^4`
- `file` holds letters and digits (no spaces, to keep chunk boundaries unambiguous).
- `1 <= queries.length <= 100`
- `0 <= queries[i] <= 10^4`

**Adaptation note:** The original LeetCode task is a stateful class (`Reader4.read` keeps an internal buffer across calls). To fit the judge's stateless-function model, the batch of call sizes is passed as `queries` (`int_array`) and the per-call results are returned together as `string_list`. The chunking behavior, including leftovers carried between calls, is identical to sequential calls.
