// Nullable
type Nullable<T> = T | null

// Only set specific keys to optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
