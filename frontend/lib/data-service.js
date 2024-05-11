import {Utils} from "./utils.js";

class DataService {
  static async getQuestions() {
    return await fetch(`${Utils.apiURL()}/api/questions/all`, {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem("jwt")
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else return undefined;
    }).catch((error) => {
      console.log(`Error fetching questions: ${error}`);
      return undefined;
    });
  }
}

export { DataService }