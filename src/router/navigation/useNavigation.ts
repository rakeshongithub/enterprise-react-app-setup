import { useContext } from "react";

import NavigationContext from "./NavigationContext";

export default function useNavigation() {
  const context = useContext(NavigationContext);

  if (!context) throw new Error("Missing NavigationProvider");

  return context;
}
