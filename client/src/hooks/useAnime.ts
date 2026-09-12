import { useEffect, useRef } from 'react';
import anime from 'animejs';

/** Stagger-fade-in a group of elements on mount */
export function useStaggerFadeIn(
  selector: string,
  options: { delay?: number; duration?: number; translateY?: number } = {}
) {
  const ref = useRef<HTMLDivElement>(null);
  const { delay = 80, duration = 700, translateY = 28 } = options;

  useEffect(() => {
    if (!ref.current) return;
    const targets = ref.current.querySelectorAll(selector);
    anime({
      targets,
      opacity: [0, 1],
      translateY: [translateY, 0],
      duration,
      delay: anime.stagger(delay),
      easing: 'easeOutExpo',
    });
  }, [selector, delay, duration, translateY]);

  return ref;
}

/** Animate a number counter from 0 to target */
export function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obj = { val: 0 };
    anime({
      targets: obj,
      val: target,
      duration,
      easing: 'easeOutExpo',
      round: 1,
      update() {
        el.textContent = obj.val.toString();
      },
    });
  }, [target, duration]);

  return ref;
}

/** Animate a progress bar width */
export function useProgressBar(
  pct: number,
  options?: number | { duration?: number; delay?: number }
) {
  const ref = useRef<HTMLDivElement>(null);
  const delay = typeof options === 'number' ? options : options?.delay ?? 0;
  const duration = typeof options === 'object' && options?.duration ? options.duration : 1200;

  useEffect(() => {
    if (!ref.current) return;
    anime({
      targets: ref.current,
      width: [`0%`, `${pct}%`],
      duration,
      delay,
      easing: 'easeOutExpo',
    });
  }, [pct, delay, duration]);

  return ref;
}

/** Fade + scale-in a single element */
export function useFadeScaleIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    anime({
      targets: ref.current,
      opacity: [0, 1],
      scale: [0.88, 1],
      duration: 800,
      delay,
      easing: 'easeOutExpo',
    });
  }, [delay]);

  return ref;
}

/** Lady Justice rotation glow pulse */
export function useLadyJusticePulse() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    anime({
      targets: ref.current,
      opacity: [0, 1],
      translateY: [-12, 0],
      scale: [0.9, 1],
      duration: 1400,
      easing: 'easeOutElastic(1, .6)',
    });
  }, []);

  return ref;
}
