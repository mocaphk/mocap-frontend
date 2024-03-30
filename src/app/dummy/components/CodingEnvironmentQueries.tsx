"use client";

import {
    useGetCodingEnvironmentQuery,
    useCreateCodingEnvironmentMutation,
    useUpdateCodingEnvironmentMutation,
    GetCodingEnvironmentDocument,
} from "../queries/codingEnvironment.graphql";
import { useState } from "react";

export default function DummyQueries() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dockerfile, setDockerfile] = useState("");

    const { data: getCodEnvData } = useGetCodingEnvironmentQuery({
        variables: { id: "1" },
    });

    const [createCodEnvFunc, { data: createCodEnvData }] =
        useCreateCodingEnvironmentMutation();

    const [updateCodEnvFunc, { data: updateCodEnvData }] =
        useUpdateCodingEnvironmentMutation();

    const handleCreateCodEnvClick = async () => {
        await createCodEnvFunc({
            variables: {
                input: {
                    name: name,
                    description: description,
                    dockerfile: dockerfile,
                },
            },
        });
    };

    const handleUpdateCodEnvClick = async () => {
        await updateCodEnvFunc({
            variables: {
                id: "1",
                input: {
                    name: name,
                    description: description,
                    dockerfile: dockerfile,
                },
            },
            // you can refetch queries after mutation, for example, the
            // GetCodingEnvironment query is refetched, i.e. getCodEnvData is updated
            refetchQueries: [
                { query: GetCodingEnvironmentDocument, variables: { id: "1" } },
            ],
            awaitRefetchQueries: true,
        });
    };

    return (
        <div>
            <h1>getCodingEnvironment of id 1:</h1>
            <p>Name: {getCodEnvData?.codingEnvironment?.name}</p>
            <p>Description: {getCodEnvData?.codingEnvironment?.description}</p>
            <p>Dockerfile: {getCodEnvData?.codingEnvironment?.dockerfile}</p>
            <br />

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="text"
                placeholder="Dockerfile"
                value={dockerfile}
                onChange={(e) => setDockerfile(e.target.value)}
            />

            <h1>Create Coding Environment:</h1>
            <br />
            <button onClick={handleCreateCodEnvClick}>
                Click to Create Coding Environment
            </button>
            {createCodEnvData?.createCodingEnvironment && (
                <div>
                    <p>Created Coding Environment:</p>
                    <p>Name: {createCodEnvData.createCodingEnvironment.name}</p>
                    <p>
                        Description:{" "}
                        {createCodEnvData.createCodingEnvironment.description}
                    </p>
                    <p>
                        Dockerfile:{" "}
                        {createCodEnvData.createCodingEnvironment.dockerfile}
                    </p>
                    <p>
                        Is built:{" "}
                        {String(
                            createCodEnvData.createCodingEnvironment.isBuilt
                        )}
                    </p>
                </div>
            )}
            <br />

            <h1>Update Coding Environment with id 1:</h1>
            <br />
            <button onClick={handleUpdateCodEnvClick}>
                Click to Update Coding Environment
            </button>
            {updateCodEnvData?.updateCodingEnvironment && (
                <div>
                    <p>Updated Coding Environment:</p>
                    <p>Name: {updateCodEnvData.updateCodingEnvironment.name}</p>
                    <p>
                        Description:{" "}
                        {updateCodEnvData.updateCodingEnvironment.description}
                    </p>
                    <p>
                        Dockerfile:{" "}
                        {updateCodEnvData.updateCodingEnvironment.dockerfile}
                    </p>
                    <p>
                        Is built:{" "}
                        {String(
                            updateCodEnvData.updateCodingEnvironment.isBuilt
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
