import validator from "validator";

export const requiredFields = ["driverName", "email", "phone", "rideshareServices", "cities",]
export const additionalFields = ["description",]
export const notEditableFields = ["email", "tabletIds", "referralCode"]
export const fieldToDescription = {
    "driverName": "Your Full Name:",
    "email": "Your Email Address:",
    "password": "Your Password:",
    "phone": "Your Phone Number:",
    "rideshareServices": "Your Rideshare Services:",
    "cities": "Cities You Drive In:",
    "description": "A Message To Riders:",
    "languages": "Languages:"
}
export const fieldToPrompt = {
    "driverName": "First Last",
    "email": "johndoe@domain.com",
    "password": "8 or more characters, 1 or more: capitals, lowercase, numbers, special characters",
    "phone": "### ### ####",
    "rideshareServices": "eg. Uber, Lyft (Comma Seperated)",
    "cities": "eg. Toronto, Detroit (Comma Seperated)",
    "description": "A nice message to your riders",
    "languages": "eg. English, French (Comma Seperated)"
}

export const fieldToFeedback = {
    "driverName": "Name should include First and Last, eg. 'John Doe'",
    "email": "The email you signed up with is not a valid email address",
    "password": "Password has at least 1 capital, lowercase, number, and special character, and is at least 8 characters long",
    "phone": "Phone number should be 10 digits eg. '(555) 123-4567'",
    "rideshareServices": "Rideshare Services should be comma seperated list eg. 'Uber, Lyft'",
    "cities": "Cities should be valid cities in comma seperated list eg. 'Toronto, Detroit'",
    "description": "Message to riders should be valid ASCII text",
    "languages": "Make sure languages are a comma seperated list"
}

export const isValidDriverObject = (driver) => {
    return requiredFields.every((field) => { return driver[field] })
}

export const fieldValueToString = (field, content) => {
    if (typeof content === "string") {
        return content
    }
    switch (field) {
        case "driverName":
            return Object.values(content).reverse().join(" ")
        case "cities":
            return content.join(", ")
        case "rideshareServices":
            return content.join(", ")
        case "tabletIds":
            return content.join(", ")
        case "languages":
            return content.join(", ")
        default:
            return content
    }
}

export const fieldInputToValue = (field, input) => {
    let string = ""
    if (!input) {
        return false
    } else {
        string = field === "password" ? input : validator.trim(input + "")
    }
    switch (field) {
        case "driverName":
            if (!string) return undefined
            const driverName = string
                .split(" ")
                .map((str) => { return validator.matches(validator.trim(str), /^[a-zA-Z-]+$/i) ? validator.trim(str) : undefined })
                .filter(str => { return str })
            return driverName.length > 1 ? { "first": driverName[0], "last": driverName.slice(1).join(" ") } : undefined
        case "email":
            return validator.isEmail(string) ? validator.normalizeEmail(string) : undefined
        case "password":
            return validator.matches(string, /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/) ? string : undefined
        case "phone":
            let cleaned = ('' + string).replace(/\D/g, '')
            let match = cleaned.match(/^(\d|)?(\d{3})(\d{3})(\d{4})$/)
            if (match) {
                var intlCode = (match[1] ? '+' + match[1] + " " : '')
                return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
            } else {
                return undefined
            }
        case "cities":
            const cities = string
                .split(",")
                .map((str) => { return validator.matches(validator.trim(str), /^[a-zA-Z- ]+$/i) ? validator.trim(str) : undefined })
                .filter(str => { return str })
            return cities.length > 0 ? cities : undefined
        case "rideshareServices":
            const services = string
                .split(",")
                .map((str) => { return validator.matches(validator.trim(str), /^[\w\- ]+$/i) ? validator.trim(str) : undefined })
                .filter(str => { return str })
            return services.length > 0 ? services : undefined
        case "description":
            return validator.isAscii(string) ? validator.trim(string) : undefined
        default:
            return undefined
    }
}
