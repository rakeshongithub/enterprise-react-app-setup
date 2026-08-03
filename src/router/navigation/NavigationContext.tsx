import { createContext } from "react";
import { type NavigationState } from "./NavigationState";

const NavigationContext = createContext<NavigationState>({
  tree: [],
  lookup: new Map(),
  routeLookup: new Map(),
});

export default NavigationContext;
