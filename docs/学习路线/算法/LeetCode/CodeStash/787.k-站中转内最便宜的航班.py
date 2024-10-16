#
# @lc app=leetcode.cn id=787 lang=python3
#
# [787] K 站中转内最便宜的航班
#

# @lc code=start
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        f = [float("inf")] * n
        f[src] = 0
        ans = float("inf")
        for t in range(1, k+2):
            g = [float("inf")] * n
            for j, i, cost in flights:
                g[i] = min(g[i], f[j]+cost)
            f = g
            ans = min(ans, f[dst])
        
        return -1 if ans == float("inf") else ans

# @lc code=end

