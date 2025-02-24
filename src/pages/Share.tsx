import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Share = () => {
    const { uuid } = useParams<{ uuid: string }>();

    useEffect(() => {
        if (uuid) {
            window.location.href = `/producto/${uuid}`;
            console.log("uuid: ", uuid);
        }
    }, [uuid]);

    return null; // No renderiza nada, solo redirige
};

export default Share;
