import { flushSync } from "react-dom";

/** Same circular reveal, timing and easing observed in the institutional portal. */
export function revealTheme(theme: "light" | "dark", commit: () => void, reduced: boolean, origin?: { x: number; y: number }) {
   const apply = () => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      flushSync(commit);
   };
   if (!document.startViewTransition || reduced || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
   }
   const button = document.querySelector('header button[aria-label="Alternar tema"]')?.getBoundingClientRect();
   const x = origin?.x ?? (button ? button.left + button.width / 2 : innerWidth - 36);
   const y = origin?.y ?? (button ? button.top + button.height / 2 : 36);
   const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
   const transition = document.startViewTransition(apply);
   void transition.ready
      .then(() => {
         document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            {
               duration: 650,
               easing: "cubic-bezier(.87,.12,0,.78)",
               pseudoElement: "::view-transition-new(root)",
            },
         );
      })
      .catch(() => {
         /* A newer navigation can skip an in-flight snapshot. */
      });
}
