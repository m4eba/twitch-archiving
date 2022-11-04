export interface GraphQLRequest {
    operationName: string;
    variables: any;
    extensions: {
        persistedQuery: {
            version: number;
            sha256Hash: string;
        };
    };
}
export declare const VideoAccessToken_Clip: (slug: string) => GraphQLRequest;
export declare const WatchLivePrompt: (slug: string) => GraphQLRequest;
export declare const ClipsFullVideoButton: (slug: string) => GraphQLRequest;
export declare const ClipsChatReplay: (slug: string, offset: number) => GraphQLRequest;
export declare function gql(clientId: string, req: GraphQLRequest[]): Promise<any>;
