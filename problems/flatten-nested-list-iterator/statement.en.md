This is an offline adaptation of an iterator task. Instead of writing a class with `next` and `hasNext`, you write one function that returns the whole flattened order at once:

```
flattenNestedList(nestedList)
```

`nestedList` arrives serialized as text, e.g. `"[[1,1],2,[1,1]]"`: brackets delimit lists, bare numbers (possibly negative) are integers, commas separate elements. Flattening means reading all integers in left-to-right order, descending into every nested list. Return them as an array in that order.

**Constraints:**
- `1 <= nestedList.length <= 500`
- Integers lie in `[-10^6, 10^6]`.
- The text is always a valid nested list.

**Adaptation note:** The classic version exposes a `NestedIterator` class over `NestedInteger` objects. Here the structure is passed as a serialized `string` and you return the full flattened `int_array`.
