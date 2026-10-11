Add one to a number stored digit-by-digit in forward order in a linked list.

Each node of the singly linked list holds one decimal digit, with the most significant digit at the head. Interpret the whole chain as a non-negative integer without leading zeros (except the single digit `0` itself) and return the head of the list that represents the value plus one. The length may grow by one digit when every digit rolls over, for example `[9,9]` becoming `[1,0,0]`.

**Constraints:**
- `1 <= number of nodes <= 100`
- `0 <= Node.val <= 9`
- The digits contain no leading zeros except the number zero itself.
