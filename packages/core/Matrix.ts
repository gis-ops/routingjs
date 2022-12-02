class Matrix<T> {
    constructor(
        public readonly durations: (number | null | undefined)[][],
        public readonly distances: (number | null | undefined)[][],
        public readonly raw: T
    ) {}
}

export default Matrix
