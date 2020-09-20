import axios from 'axios';

const url = "http://history:4002/api/history/";

class HistoryService {

    static async getHeater() {
        alert(url + 'heater');
        return await axios.get(`${url}heater`);
    }

    static async getLamp() {
        return await axios.get(`${url}lamp`);
    }

    static async getVacuum() {
        return await axios.get(`${url}vacuum`);
    }

}

export default HistoryService;