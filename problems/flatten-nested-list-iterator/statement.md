This is an offline adaptation of an iterator task. Instead of writing a class with `next` and `hasNext`, you write one function that returns the whole flattened order at once:

```
flattenNestedList(nestedList)
```

`nestedList` arrives serialized as text, e.g. `"[[1,1],2,[1,1]]"`: brackets delimit lists, bare numbers (possibly negative) are integers, commas separate elements. Flattening means reading all integers in left-to-right order, descending into every nested list. Return them as an array in that order.

**Example 1:**
```
Input: nestedList = "[[1,1],2,[1,1]]"
Output: [1,1,2,1,1]
Explanation: The first pair yields 1, 1, then the lone 2, then the last pair yields 1, 1.
```

**Example 2:**
```
Input: nestedList = "[1,[4,[6]]]"
Output: [1,4,6]
Explanation: Depth-first left-to-right reading gives 1, then 4, then 6.
```

**Example 3:**
```
Input: nestedList = "[]"
Output: []
Explanation: An empty top list contains no integers.
```

**Constraints:**
- `1 <= nestedList.length <= 500`
- Integers lie in `[-10^6, 10^6]`.
- The text is always a valid nested list.

**Adaptation note:** The classic version exposes a `NestedIterator` class over `NestedInteger` objects. Here the structure is passed as a serialized `string` and you return the full flattened `int_array`.
