export function createSearchPath(table, N, EVERYFORMAT) {
    return function search_path(start, target) {
        if (start === target) return [];

        const distance = Array(N).fill(Infinity);
        const prev = Array(N).fill(null);
        const done = new Set();

        distance[start] = 0;

        while (true) {
        let cur = -1;
        for (let i = 0; i < N; i++) {
            if (
            !done.has(i) && distance[i] < Infinity
            && (cur === -1 || distance[i] < distance[cur])
            ) cur = i;
        }

        if (cur === -1) return null;
        if (cur === target) break;
        done.add(cur);

        for (let next = 0; next < N; next++) {
            const cell = table[cur][next];
            if (cell && distance[cur] + cell.cost < distance[next]) {
            distance[next] = distance[cur] + cell.cost;
            prev[next] = [cur, cell];
            }
        }
        }
        const path = [];
        for (let i = target; prev[i]; i = prev[i][0]) {
        path.unshift({
            from: EVERYFORMAT[prev[i][0]],
            to: EVERYFORMAT[i],
            func: prev[i][1].func,
        });
        }

        return path;
    };
}