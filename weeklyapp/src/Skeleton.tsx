import { observer } from "mobx-react";
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import * as C from "./Constants";

interface IProps {
}

@observer
class Skeleton extends Component<IProps> {

  public render() {
    return (
      <>
      </>
    );
  }
}

export const Skeleton2 = observer((props: IProps) => {
  return <></>;
});

const style = StyleSheet.create({

});

export { Skeleton };
