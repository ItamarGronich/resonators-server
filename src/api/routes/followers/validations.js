import { isUuid } from "./utils";

/**
 * A validator middleware factory.
 * 
 * @param {Function} predicate - the validation predicate. of the form: (req) => Boolean.
 * @param {Function} getError - a function for computing an error message in case validation fails. of the form (req) => String.
 * @param {Number} status - the HTTP return code with which to send the error response
 */
const validate = (predicate, getError, status = 400) => (req, res, next) =>
    Promise.resolve(predicate(req)).then((valid) => {
        if (valid) next();
        else res.status(status).error(getError(req));
    });

export const validatePageNum = validate(
    (req) => !(req.query.page && Number.isNaN(parseInt(req.query.page))),
    () => "Page specifier must be a number"
);

export const validateUuid = (getter) =>
    validate(
        (req) => isUuid(getter(req)),
        (req) => `${getter(req)} is not a valid UUID!`
    );
