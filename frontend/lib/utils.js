class Utils {
    static isNullOrUndefined(value) {
        return (value === undefined || value === null);
    }
    static apiURL() {
        let baseURLMatch = window.location.host.match(/^(.*):\d*$/);
        let hostURL = "";
        if (baseURLMatch == null) {
            hostURL = window.location.host
        } else {
            hostURL = baseURLMatch[1];
        }
        return window.location.protocol + '//' + hostURL + ":5000";
    }
}
export { Utils };
