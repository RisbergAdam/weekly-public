import { Alert } from "react-native";
import { AppState } from "../../AppState";
import { Box } from "../../utils/Box";
import { Navigation } from "../../utils/ComponentUtils";
import { allObservable } from "../../utils/Decorators";

@allObservable
class ProfileStore {
    public firstName = new Box("");

    public lastName = new Box("");

    public exitProfileView = (navigation: Navigation) => () => {
        navigation.pop();
    }

    public save = (state: AppState, navigation: Navigation) => async () => {
        const { api } = state.services;
        const { firstName, lastName } = this;

        state.loadStack.push();
        await api.putProfile(firstName.value, lastName.value);
        await state.services.shareLink.refresh();
        state.user!.firstName = firstName.value;
        state.user!.lastName = lastName.value;
        state.loadStack.pop();

        navigation.pop();
    }
}

export { ProfileStore };
