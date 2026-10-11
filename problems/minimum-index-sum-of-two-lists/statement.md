Two friends each rank favorite eateries in order. The combined rank of a shared name is its index in the first list plus its index in the second. Return all shared names with the smallest combined rank, in any order.

**Example 1:**
```
Input: list1 = ["Shogun","Tapioca Express","Burger King","KFC"], list2 = ["Piatti","The Grill at Torrey Pines","Hungry Hunter Steakhouse","Shogun"]
Output: ["Shogun"]
```

**Example 2:**
```
Input: list1 = ["Shogun","Tapioca Express","Burger King","KFC"], list2 = ["KFC","Shogun","Burger King"]
Output: ["Shogun"]
```

**Example 3:**
```
Input: list1 = ["happy","sad","good"], list2 = ["sad","happy","good"]
Output: ["sad","happy"]
```

**Constraints:**
- Each list holds 1 to 1000 distinct names.
- At least one name is shared.
