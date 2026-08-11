import { createContext, useContext } from "react";

/* True when a <Reveal> sits inside a <Stagger>, in which case the parent owns
   the scroll trigger and the child just declares its variants. */
export const StaggerContext = createContext(false);
export const useInStagger = () => useContext(StaggerContext);
