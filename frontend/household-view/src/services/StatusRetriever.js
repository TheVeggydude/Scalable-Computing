import axios from 'axios';

const url = "http://localhost:4004/api/prediction";

class StatusRetriever {
    static async getStatus() {
        return await axios.get(`${url}`);
    }
}

export default StatusRetriever;