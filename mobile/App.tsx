import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import SimpleTabNavigator from "@/navigation/SimpleTabNavigator";

import Providers from "@shared/context/AllProviders";

export default function App() {
  return (
    <Providers>
      <NavigationContainer>
        <SimpleTabNavigator />
      </NavigationContainer>
    </Providers>
  );
}
