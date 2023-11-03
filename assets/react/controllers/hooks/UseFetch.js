import { useEffect, useState } from "react";

export function UseFetch(url, options = {}) {
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState(null);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        fetch(url, {
            ...options,
            headers: {
                Accept: "application/json; charset=UTF-8",
                ...options.headers,
            },
        })
            .then((r) => r.json())
            .then((datas) => {
                setDatas(datas);
            })
            .catch(() => {
                setErrors(
                    "Une erreur pour récuperer les articles c'est produite"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return {
        loading,
        datas,
        errors,
        setDatas,
    };
}
