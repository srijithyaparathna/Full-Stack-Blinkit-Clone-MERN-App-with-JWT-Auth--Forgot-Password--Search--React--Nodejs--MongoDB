import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.userDetails,
        });

        // Log the data before returning it
        console.log("data:", response.data);

        // Return the fetched data
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null; // Return null or handle as needed in case of an error
    }
};

export default fetchUserDetails;
