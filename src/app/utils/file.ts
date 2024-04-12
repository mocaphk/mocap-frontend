export function readFileContent(file: File) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = function (event) {
            if (event.target) {
                const fileContent = event.target.result;
                resolve(fileContent);
            } else {
                reject(new Error("Event target is null"));
            }
        };

        fileReader.onerror = function (error) {
            reject(error);
        };

        fileReader.readAsText(file);
    });
}
