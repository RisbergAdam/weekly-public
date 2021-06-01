import { observer } from "mobx-react";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import * as C from "./../Constants";
import { Renderable, renderRenderable } from "../utils/Renderable";
import { Button } from "./Button";

interface IProps {
  onConfirm?: () => any;
  onCancel?: () => any;
  confirm: string;
  cancel: string;
}

export const ConfirmButtons = observer((props: IProps) => {
  const { onConfirm = () => {}, onCancel = () => {} } = props;
  const { confirm, cancel } = props;

  return (
    <View style={style.buttons}>
      <Button
        containerStyle={{flex: 3}}
        text={confirm}
        onPress={onConfirm}
        dark
      />
      <View style={{width: C.SmallGutter}}/>
      <Button
        containerStyle={{flex: 1}}
        text={cancel}
        onPress={onCancel}
      />
    </View>
  );
});

const style = StyleSheet.create({
  buttons: {
    marginTop: C.SmallGutter,
    flexDirection: "row",
    width: "100%",
  }
});
