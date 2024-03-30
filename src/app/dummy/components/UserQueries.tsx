"use client";

import { useGetUserQuery, useGetAllUsersQuery } from "../queries/user.graphql";

export default function UserQueries() {
    const { data: user } = useGetUserQuery();

    const { data: users } = useGetAllUsersQuery();

    return (
        <div>
            <h1>
                Hello {user?.user?.username}!
                <br />
                Id: {user?.user?.id}
                <br />
                First name: {user?.user?.firstName}
                <br />
                Last name: {user?.user?.lastName}
            </h1>
            <br />
            <h1>
                {users?.allUsers?.map((user) => {
                    return <p key={user?.id}>{user?.username}</p>;
                })}
            </h1>
        </div>
    );
}
