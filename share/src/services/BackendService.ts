import * as got from "got";
import { Ok, Fail, Result } from "../Result";
import { AccountInformation, Id } from "src/Types";

export type IntrospectResponse = Result<{ profile: AccountInformation }>
export class BackendService {

    private client = new BackendClient();

    public async intospect(accessToken: string): Promise<IntrospectResponse> {
        try {
            return Ok(await this.client.withToken(accessToken).get("/api/introspect-account"));
        } catch(e) {
            return Fail(e);
        }
    }

    public async canEnterWorkspace(accountId: Id, workspace: Id): Promise<boolean> {
        return await this.client.get("/api/workspaces/can-enter", { workspaceId: workspace, accountId });
    }
}

class BackendClient {

    private headers: any = {};

    constructor(headers: any = {}) {
        this.headers = headers;
    }

    public async get(path: string, params: any = {}): Promise<any> {
        const response = await got(path, this.createParams(params, undefined));
        return JSON.parse(response.body);
    }

    public withToken(accessToken: string): BackendClient {
        return new BackendClient({ ...this.headers, authorization: "Bearer " + accessToken });
    }

    private createParams = (searchParams: any, bodyParams: any) => ({
        baseUrl: "http://127.0.0.1:7000",
        headers: this.headers,
        query: searchParams,
        body: bodyParams
    })

}