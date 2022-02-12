import { useState, useEffect } from "react";

const useRefreshVacation = () => {}

/*
const useLocalStorage = (key, initValue) => {
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value])

    return [value, setValue];
}
 */