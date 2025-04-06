type NoopSrc = () => void;
type AscyncNoopSrc = () => Promise<void>;

export type Noop = NoopSrc | AscyncNoopSrc;
