import { observer } from "mobx-react";
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { asOverlay } from "../../utils/ComponentUtils";
import { SafestView } from "../../components";

interface IProps {
  show: boolean;
}

export const DeleteModal = asOverlay(observer((props: IProps) => {
  return (
    <SafestView bottomColor="white" topColor="white">
      
    </SafestView>
  );
}));

const style = StyleSheet.create({

});

