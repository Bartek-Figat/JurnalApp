import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * useEffectOnceWhen hook
 *
 * @description It fires a callback once when a condition is true or become true.
 * Fires the callback at most one time.
 *
 * @param callback The callback to fire
 * @param when The condition which needs to be true
 * @see https://rooks.vercel.app/docs/useEffectOnceWhen
 */
function useEffectOnceWhen(callback: () => void, when = true): void {
	const hasRunOnceRef = useRef(false)
	const callbackRef = useRef(callback)
	useEffect(() => {
		callbackRef.current = callback
	})
	useEffect(() => {
		if (when && !hasRunOnceRef.current) {
			callbackRef.current()
			hasRunOnceRef.current = true
		}
	}, [when])
}

function useLayoutEffectOnceWhen(callback: () => void, when = true): void {
	const hasRunOnceRef = useRef(false)
	const callbackRef = useRef(callback)

	// Not very legal, but needed for the callback to be updated in time
	callbackRef.current = callback

	useLayoutEffect(() => {
		if (when && !hasRunOnceRef.current) {
			callbackRef.current()
			hasRunOnceRef.current = true
		}
	}, [when])
}

export { useEffectOnceWhen, useLayoutEffectOnceWhen }
