import React from "react";
import { StyleSheet, View } from "react-native";

export const Centered = ({ children }: { children: any }) => (
    <View style={style.centered}>
        {children}
    </View>
);

const style = StyleSheet.create({
    centered: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});
