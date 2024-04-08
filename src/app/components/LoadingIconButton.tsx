import { CircularProgress, IconButton } from "@mui/material";

export default function LoadingIconButton(
    props: React.ComponentProps<typeof IconButton> & {
        loading?: boolean;
    }
) {
    const { loading, ...otherProps } = props;

    if (loading) {
        return (
            <IconButton {...otherProps} disabled>
                <CircularProgress
                    color={props.color === "default" ? "primary" : props.color}
                    size="24px"
                />
            </IconButton>
        );
    }

    return <IconButton {...otherProps} />;
}
