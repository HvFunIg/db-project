/*React не умеет отслеживать изменения в useRef,
* поэтому надо слздать штуку, отслеживающую это.
* Подробнее в какой-то статье Дена Абрамова
 */
import {useRef, useEffect} from 'react';
export function useInterval(callback, delay) {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(()=> {
        function tick() {
            savedCallback.current ?.()
        }

        if (delay !==null){
            const id = setInterval(tick,delay)
            return()=>clearInterval(id)
        } else {
            return () => {}
        }
    },delay)

}