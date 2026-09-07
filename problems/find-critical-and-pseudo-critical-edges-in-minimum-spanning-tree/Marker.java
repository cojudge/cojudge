import java.util.*;
class Marker {
    public int[][] findCriticalAndPseudoCriticalEdges(int n, int[][] edges) {
        int m = edges.length;
        int[][] es = new int[m][4];
        for (int i = 0; i < m; i++) {
            es[i][0] = edges[i][0]; es[i][1] = edges[i][1]; es[i][2] = edges[i][2]; es[i][3] = i;
        }
        Arrays.sort(es, (a, b) -> a[2] - b[2]);
        int base = mst(n, es, -1, -1);
        List<Integer> crit = new ArrayList<>(), pseudo = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            int without = mst(n, es, es[i][3], -1);
            if (without > base) { crit.add(es[i][3]); continue; }
            int with = mst(n, es, -1, es[i][3]);
            if (with == base) pseudo.add(es[i][3]);
        }
        Collections.sort(crit); Collections.sort(pseudo);
        return new int[][]{ toArr(crit), toArr(pseudo) };
    }
    private int[] toArr(List<Integer> list) {
        int[] a = new int[list.size()];
        for (int i = 0; i < list.size(); i++) a[i] = list.get(i);
        return a;
    }
    // exclude original index, force original index
    private int mst(int n, int[][] es, int exclude, int force) {
        UF uf = new UF(n);
        int weight = 0, used = 0;
        if (force != -1) {
            for (int[] e : es) if (e[3] == force) {
                uf.union(e[0], e[1]); weight += e[2]; used++; break;
            }
        }
        for (int[] e : es) {
            if (e[3] == exclude || e[3] == force) continue;
            if (uf.union(e[0], e[1])) { weight += e[2]; used++; }
        }
        return used == n - 1 ? weight : Integer.MAX_VALUE / 2;
    }
    class UF {
        int[] p, r;
        UF(int n) { p = new int[n]; r = new int[n]; for (int i = 0; i < n; i++) p[i] = i; }
        int find(int x) { return p[x] == x ? x : (p[x] = find(p[x])); }
        boolean union(int a, int b) {
            a = find(a); b = find(b);
            if (a == b) return false;
            if (r[a] < r[b]) { int t = a; a = b; b = t; }
            p[b] = a; if (r[a] == r[b]) r[a]++;
            return true;
        }
    }
    public boolean isCorrect(int n, int[][] edges, int[][] output) {
        int[][] exp = findCriticalAndPseudoCriticalEdges(n, edges);
        if (output == null || output.length != 2) return false;
        return sameSet(exp[0], output[0]) && sameSet(exp[1], output[1]);
    }
    private boolean sameSet(int[] a, int[] b) {
        if (a == null || b == null || a.length != b.length) return false;
        int[] x = a.clone(), y = b.clone();
        Arrays.sort(x); Arrays.sort(y);
        return Arrays.equals(x, y);
    }
}
