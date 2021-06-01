import { Product } from "../domain/Product";
import { ProductCategory } from "../domain/ProductCategory";
import { Workspace, WorkspaceDetails, WorkspaceInvitation } from "../domain/Workspace";
import { Client } from "./Client";
import { Alert } from "react-native";

class Api {

    constructor(private client: Client) {

    }

    public postLogin(deviceId: string): Promise<IPostLoginResponse> {
        return this.client.post("/api/login/shared-secret", { secret: deviceId });
    }

    public postRegister(deviceId: string): Promise<{}> {
        return this.client.post("/api/register/shared-secret", { secret: deviceId });
    }

    public putProfile(firstName: string, lastName: string): Promise<{}> {
        return this.client.put("/api/profile", { firstName, lastName });
    }

    public getData(): Promise<IGetDataResponse> {
        return this.client.get("/api/data");
    }

    public getWorkspace(id: number): Promise<WorkspaceDetails> {
        return this.client.get("/api/workspaces/" + id);
    }

    public patchWorkspace(id: number, name: string): Promise<{statusCode: number}> {
        return this.client.patch("/api/workspaces/" + id, { name });
    }

    public getWorkspaces(): Promise<Workspace[]> {
        return this.client.get("/api/workspaces");
    }

    public joinWorkspace(code: string): Promise<JoinWorkspaceResponse> {
        return this.client.put("/api/workspaces/join?code=" + code);
    }

    public createWorkspace(name: string): Promise<Workspace> {
        return this.client.post("/api/workspaces?name=" + name);
    }

    public leaveWorkspace(workspaceId: number): Promise<{}> {
        return this.client.put("/api/workspaces/"+workspaceId+"/leave");
    }

    public createInvitation(workspaceId: number): Promise<WorkspaceInvitation> {
        return this.client.post("/api/workspaces/"+workspaceId+"/invite", { isSingleUse: false, lifetime: 1800 });
    }

}

interface IPostLoginResponse {
    token: string;
}

interface IGetDataResponse {
    products?: Product[];
    categories?: ProductCategory[];
    profile?: {
        id: number;
        firstName: string;
        lastName: string;
    };
}

type JoinWorkspaceResponse = Workspace & { statusCode: number };

export { Api };
