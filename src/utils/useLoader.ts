import React, { useState, useEffect } from "react";

type LoadingFunc<T> = () => Promise<T>;

export default function useLoader<TData>(initialState: TData, loader: LoadingFunc<TData>, dependencies?: React.DependencyList) {
    const [data, setData] = useState<TData>(initialState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function onLoad() {
            setLoading(true);
            try {
                const data = await loader();

                setData(data);
                setError(null);
            } catch (err) {
                setData(initialState);
                setError("" + err);
            }

            setLoading(false);
        }

        onLoad();
    // esline-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    function externalSetData(data: TData | ((x?: TData) => TData)) {
        setData(data);
        setError(null);
        setLoading(false);
    }

    function externalSetError(error: string | null) {
        setData(initialState);
        setError(error);
        setLoading(false);
    }

    return { 
        data, setData: externalSetData,
        loading, 
        error, setError: externalSetError,
     };
}