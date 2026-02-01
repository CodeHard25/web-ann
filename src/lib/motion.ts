const easeCinematic: [number, number, number, number] = [0.16, 1, 0.3, 1];
const easeSnappy: [number, number, number, number] = [0.22, 1, 0.36, 1];
const easeLoop: [number, number, number, number] = [0.42, 0, 0.58, 1];

export const transitions = {
  major: { duration: 0.4, ease: easeCinematic },
  micro: { duration: 0.2, ease: easeSnappy },
};

export const pageEnter = {
  opacity: 1,
  scale: 1,
  transition: transitions.major,
};

export const pageExit = {
  opacity: 0,
  scale: 1.02,
  transition: transitions.major,
};

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: transitions.micro },
  exit: { opacity: 0, y: 8, transition: transitions.micro },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.micro },
  exit: { opacity: 0, transition: transitions.micro },
};

export const blurToSharp = {
  initial: { opacity: 0, filter: "blur(8px)" },
  animate: { opacity: 1, filter: "blur(0px)", transition: transitions.major },
  exit: { opacity: 0, filter: "blur(6px)", transition: transitions.micro },
};

export const floatIdle = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 4, repeat: Infinity, ease: easeLoop },
  },
};

export const stampPop = {
  initial: { opacity: 0, scale: 0.6, rotate: -8 },
  animate: { opacity: 1, scale: 1, rotate: 0, transition: transitions.major },
};

export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(255, 126, 182, 0.18)",
      "0 0 40px rgba(255, 126, 182, 0.35)",
      "0 0 20px rgba(255, 126, 182, 0.18)",
    ],
    transition: { duration: 3, repeat: Infinity, ease: easeLoop },
  },
};

export const pageTransitionVariants = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};
