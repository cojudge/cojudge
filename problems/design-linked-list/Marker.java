import java.util.*;
class Marker {
    public int[] runLinkedList(String[] operations, int[][] args) {
        List<Integer> list = new ArrayList<>();
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            int[] a = args[i];
            if (op.equals("MyLinkedList")) {
                list.clear();
            } else if (op.equals("get")) {
                int idx = a.length > 0 ? a[0] : -1;
                if (idx >= 0 && idx < list.size()) out.add(list.get(idx));
                else out.add(-1);
            } else if (op.equals("addAtHead")) {
                list.add(0, a[0]);
            } else if (op.equals("addAtTail")) {
                list.add(a[0]);
            } else if (op.equals("addAtIndex")) {
                int idx = a[0], val = a[1];
                if (idx <= 0) list.add(0, val);
                else if (idx == list.size()) list.add(val);
                else if (idx < list.size()) list.add(idx, val);
            } else if (op.equals("deleteAtIndex")) {
                int idx = a.length > 0 ? a[0] : -1;
                if (idx >= 0 && idx < list.size()) list.remove(idx);
            }
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return Arrays.equals(runLinkedList(operations.clone(), clone2d(args)), output);
    }
    private int[][] clone2d(int[][] a) {
        int[][] c = new int[a.length][];
        for (int i = 0; i < a.length; i++) c[i] = a[i].clone();
        return c;
    }
}
