/*
validator function as middleware to validate query params or body params 
by passing validateOptions object which contains types and rules of corresponding 
properties in request

Example of validateOptions:

[key should be same as in params]: {
    type: string; TODO: number | date | boolean
    required: boolean;
}

*/
const validator = (validateOptions, isBodyParam) => (req, res, next) => {
    const valueToValidate = isBodyParam ? req.body : req.query;
    const errors = {};
    const fields = Object.keys(validateOptions);
    fields.forEach((field) => {
        const fieldValidateParam = validateOptions[field]
        const fieldValue = valueToValidate[field];
        if (fieldValidateParam.required && !fieldValue) {
            errors[field] = `${field} is required!`;
        }
        let isValid;
        if (fieldValidateParam.type && fieldValue) {
            switch (fieldValidateParam.type) {
                case "string":
                case "boolean":
                    if (typeof fieldValue !== fieldValidateParam.type) {
                        errors[field] = `${field} should be ${fieldValidateParam.type} type!`;
                    }
                    break;
                case "number":
                    isValid = isNumeric(fieldValue)
                    if (!isValid) {
                        errors[field] = `${field} should be ${fieldValidateParam.type} type!`;
                    }
                    break;
                case 'date':
                    isValid = isDate(fieldValue)
                    if(!isValid){
                        errors[field] = `${field} should be ${fieldValidateParam.type} type!`;
                    }
                default:
                    break;
            }
        }
    });
    if (Object.values(errors).length) {
        res.status(400).send({
            errors,
        });
    } else {
        next();
    }   
};

// To validate if string is valid date
var isDate = function(date) {
    return /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/.test(date)
}

// To check positive number
function isNumeric(value) {
    return /^\d+$/.test(value);
}

module.exports = validator;
