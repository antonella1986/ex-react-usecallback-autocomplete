import { useEffect, useState, useCallback } from "react";

function App() {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    function debounce(callback, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                callback(...args);
            }, delay);
        }
    }

    const eseguiFetch = useCallback(debounce((query) => {
        fetch(`https://localhost:3333/products?search=${query}`)
            .then(response => response.json())
            .then(data => setResults(data))
            .catch(error => console.log(error));
    }, 1000), []);

    useEffect(() => {
        if (query === "") {
            setResults([]);
            return;
        }
        eseguiFetch(query);
    }, [query]);

    return (
        <>
            <label htmlFor="">Digit your favourite word ❤️</label>
            <input
                type="text"
                className="form-control"
                placeholder="Digit here"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <h3>Results</h3>
            {query && results.length > 0 && (
                <ul className="suggestions">
                    {results.map(item => (
                    <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            )}
        </>
    )
}

export default App