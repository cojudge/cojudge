import java.util.*;
class Marker {
    static class DSU {
        int[] p, r;
        DSU(int n){ p=new int[n]; r=new int[n]; for(int i=0;i<n;i++) p[i]=i; }
        int f(int x){ return p[x]==x?x:(p[x]=f(p[x])); }
        boolean u(int a,int b){ a=f(a); b=f(b); if(a==b) return false; if(r[a]<r[b]){int t=a;a=b;b=t;} p[b]=a; if(r[a]==r[b]) r[a]++; return true; }
    }
    public boolean validTree(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        DSU d = new DSU(n);
        for (int[] e : edges) if (!d.u(e[0], e[1])) return false;
        return true; // n-1 edges and no cycle implies connected
    }
    public boolean isCorrect(int n, int[][] edges, boolean output) {
        return validTree(n, edges) == output;
    }
}
