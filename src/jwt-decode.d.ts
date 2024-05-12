
declare module 'jwt-decode' {
    function jwt_decode(token: string): any; // Adjust the return type according to the decoded JWT structure
    export default jwt_decode;
}