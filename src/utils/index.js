export function getCamelCase(str) {
    return str.replace(/-([a-z])/g, function (all, i) {
        return i.toUpperCase();
    })
}

export function getMidLineCase(str) {
    return str.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase()
}


export function getFileName(str) {
    return str.replace(/(.*\/)*([^.]+.*)/ig, "$2");
}