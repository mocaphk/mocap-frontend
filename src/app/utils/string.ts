export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeAllWords(string: string) {
    return string
        .split(" ")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");
}

export function camelToSpace(string: string) {
    return string.replace(/([A-Z])/g, " $1").toLowerCase();
}
