import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, FadeView, OverlayContainer, SafestView, ThinHeader } from "../../components";
import { FieldBox } from "../../components/FieldBox";
import { PageComponent } from "../../utils/ComponentUtils";
import * as C from "./../../Constants";
import JoinWorkspaceModal from "../home/JoinWorkspaceModal";

@observer
class TestView extends PageComponent {
  @observable private show = false;

  public render() {
   return <>
      <OverlayContainer avoidKeyboard={false}>
        <SafestView>
          <ThinHeader/>
          <View style={style.container}>
            <Button
              style={{width: "100%"}}
              text="Toggle"
              onPress={() => this.show = !this.show}
            />
            <View style={{height: 10}}/>
            <Button
              text="Test"
              dark
              disabled={this.show}
            />
          </View>
        </SafestView>
      </OverlayContainer>
    </>;
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: C.GutterSize,
    backgroundColor: C.Background,
    flexDirection: "column",
    justifyContent: "flex-start",
    // padding: 15,
    // justifyContent: "center",
  },
});

export { TestView };
