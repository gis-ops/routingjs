export class Expansions<T> {
    constructor(
        public readonly edges: Edge[],
        public readonly center: [number, number],
        public readonly intervalType: string,
        public readonly raw: T
    ) {}
}

export class Edge{
    constructor(
        public readonly geometry: number,
        public readonly distance: number,
        public readonly duration: number,
        public readonly cost: number,
        public readonly edge_id: number,
        public readonly status: string
    ) {}
}