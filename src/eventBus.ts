export type Handler<T> = (payload: T) => void;

export class EventBus<M extends Record<string, unknown>> {
	private m = new Map<keyof M, Set<Handler<M[keyof M]>>>();

	on<K extends keyof M>(k: K, h: Handler<M[K]>) {
		const set = this.m.get(k) ?? new Set<Handler<M[keyof M]>>();
		set.add(h as Handler<M[keyof M]>);
		this.m.set(k, set);
		return () => set.delete(h as Handler<M[keyof M]>);
	}

	emit<K extends keyof M>(k: K, p: M[K]) {
		const handlers = this.m.get(k);
		if (handlers) {
			// Use Array.from to convert Set to Array for iteration
			const handlersArray = Array.from(handlers);
			for (const h of handlersArray) {
				h(p as M[keyof M]);
			}
		}
	}
}

export type SnapbackEvents = {
	"checkpoint:created": { id: string; risk?: number; trigger: string };
	"checkpoint:restored": { id: string; success: boolean };
	"risk:detected": { score: number; factors: string[]; file?: string };
	"failover:triggered": { from: "enhanced"; to: "legacy"; error: string };
};
