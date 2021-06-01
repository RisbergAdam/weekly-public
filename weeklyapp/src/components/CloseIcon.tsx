import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Slop10 } from "../utils/ComponentUtils";

const closeIcon = require("../../assets/icons/add.svg.png");

export const CloseIcon = ({ onClose }: { onClose: () => any }) => (
    <TouchableOpacity onPress={() => onClose()} hitSlop={Slop10}>
        <Image style={style.backIcon} source={closeIcon} />
    </TouchableOpacity>
);

const style = StyleSheet.create({
    backIcon: {
      height: 20,
      width: 20,
      transform: [{ rotate: "45deg" }],
      marginLeft: 8,
      marginRight: 8,
    },
});
