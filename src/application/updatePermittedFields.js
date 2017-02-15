export default function updatePermittedFields(entity, updateRequest, permittedFields) {
    Object.keys(updateRequest).forEach(field => {
        if (permittedFields.indexOf(field) !== -1) {
            entity[field] = updateRequest[field];
        }
    });
}
