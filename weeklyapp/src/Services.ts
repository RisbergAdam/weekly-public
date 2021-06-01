import { Api } from "./services/Api";
import { Client } from "./services/Client";
import { configuration } from "./Configuration";
import { AppState } from "./AppState";
import { ShareLink } from "./services/ShareLink";

class Services {

    public client: Client;

    public api: Api;

    public shareLink: ShareLink;

    constructor(appState: AppState) {
        this.client = new Client(configuration.backendUrl);

        this.api = new Api(this.client);

        this.shareLink = new ShareLink(appState);
    }

}

export { Services };
