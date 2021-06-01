export class Client {
  public token = ''

  constructor(private baseUrl: string) {}

  public setToken(token: string) {
    this.token = token
  }

  public async get<T>(path: string, params: object = {}): Promise<T> {
    const queryParams = Object.keys(params)
      .map((k) => escape(k) + '=' + escape((params as any)[k]))
      .join('&')

    return this.request(this.baseUrl + path + queryParams, 'GET') as Promise<T>
  }

  public async post<T>(path: string, params: object = {}): Promise<T> {
    return this.request(
      this.baseUrl + path,
      'POST',
      JSON.stringify(params),
    ) as Promise<T>
  }

  public async put<T>(path: string, params: object = {}): Promise<T> {
    return this.request(
      this.baseUrl + path,
      'PUT',
      JSON.stringify(params),
    ) as Promise<T>
  }

  public async patch<T>(path: string, params: object = {}): Promise<T> {
    return this.request(
      this.baseUrl + path,
      'PATCH',
      JSON.stringify(params),
    ) as Promise<T>
  }

  private async request<T>(
    path: string,
    method: string,
    body?: any,
  ): Promise<T & { statusCode: number }> {
    console.log(method + ' ' + path)

    const response = await fetch(path, {
      method,
      body,
      headers: {
        authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json',
      },
    })

    let value: any = {}

    if (response.headers.get('content-type') === 'application/json') {
      value = JSON.parse(await response.text())
    }

    value.statusCode = response.status

    return value
  }
}
