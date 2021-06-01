import { observer } from "mobx-react";
import React from "react";
import { StyleSheet, View } from "react-native";

import { Button, CloseableView, InputField } from "../../components";
import { PageComponent } from "../../utils/ComponentUtils";
import * as C from "./../../Constants";
import { ProfileStore } from "./ProfileStore";

@observer
class ProfileView extends PageComponent {
  public state = this.props.appState;
  public store = new ProfileStore();

  public componentDidMount() {
    this.store.firstName.value = this.state.user!.firstName;
    this.store.lastName.value = this.state.user!.lastName;
  }

  public render() {
    const { store, state } = this;
    const { navigation } = this.props;

    return (
      <CloseableView
        text="Edit profile"
        onClose={store.exitProfileView(navigation)}
        style={style.container}
        load={state.loadStack}
      >
        <InputField name="First name" value={store.firstName} />

        <InputField name="Last name" value={store.lastName} />

        <View style={{ flex: 1 }} />

        <Button
          style={{ width: "100%" }}
          text="Save profile"
          onPress={store.save(state, navigation)}
          dark={true}
        />
      </CloseableView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: C.GutterSize,
  },
});

export { ProfileView };
