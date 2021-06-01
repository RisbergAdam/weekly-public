import { observer } from "mobx-react";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../components/Text";
import * as C from "./../../Constants";

interface IProps {
}

@observer
class RecipesView extends Component<IProps, any> {

  public render() {
    return (
      <View style={style.container}>
        <Text>recipes</Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export { RecipesView };
