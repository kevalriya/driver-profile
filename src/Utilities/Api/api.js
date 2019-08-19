import { serverUrl } from "../../config";
import { requiredFields, additionalFields } from "../Fields";

const getDriverEndpoint = "/driver/info/";
const updateDriverEndpoint = "/driver/update/";

const requestDefaults = (type) => {
    const query = {
        credentials: 'include',
        method: type,
    }

    if (type === "GET") {
        query.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    }
    // if (serverUrl.includes("localhost:")) {
    //     query.headers.Authorization = "Bearer " + token
    // }

    return query
}

const getDriver = (receiveDriver, handleError) => {
    console.log("Getting Driver")
    const queryForDriver = {...requestDefaults("GET")}

    const endpoint = serverUrl + getDriverEndpoint
    const request = new Request(endpoint, queryForDriver)
    console.log(endpoint)
    fetch(request)
        .then(receiveDriver)
        .catch(handleError);
}

const createFormData = (driver, ref) => {
    const data = new FormData();
    if (ref) data.append('ref', ref)
    requiredFields.concat(additionalFields).forEach(field => {
        if (!driver[field]) {
            return;
        } else if (Array.isArray(driver[field])) {
            for (let i = 0; i < driver[field].length; i++) {
                data.append(field + "[" + i + "]", driver[field][i]);
            }
        } else if (typeof driver[field] === "object") {
            // wrap in a try catch?
            data.set(field, JSON.stringify(driver[field]));
        } else if (typeof driver[field] === "string") {
            data.set(field, driver[field]);
        } else {
            return;
        }
    })
    return data;
}

const createDriver = async (driverUpdate, handleCreateResponse, ref, handleError) => {
    console.log("Creating driver with ref:", ref)
    const driver = { ...driverUpdate }
    const data = createFormData(driver, ref)

    const newDriverInfo = {
        ...requestDefaults("POST"),
        body: data
    }

    const endpoint = serverUrl + updateDriverEndpoint;
    const request = new Request(endpoint, newDriverInfo)
    console.log("creating driver", endpoint, newDriverInfo)
    fetch(request)
        .then(handleCreateResponse)
        .catch(handleError);
}

const updateDriver = (driverUpdate, profile, handleUpdateResponse, handleError) => {
    const driver = { ...driverUpdate }
    const data = createFormData(driver)
    if (profile) {
        data.set('profile', profile)
        data.set('fileType', profile.type)
    }

    // Update driver info
    const updatedDriverInfo = {
        ...requestDefaults("POST"),
        body: data
    }
    const endpoint = serverUrl + updateDriverEndpoint
    const request = new Request(endpoint, updatedDriverInfo)
    console.log("updating driver", endpoint, updatedDriverInfo)
    fetch(request)
        .then(handleUpdateResponse)
        .catch(handleError);
}

export {
    getDriver,
    createDriver,
    updateDriver
}
