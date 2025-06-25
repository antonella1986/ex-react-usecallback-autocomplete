import { useEffect, useState, useCallback } from "react";

function App() {

    //useState per l'input
    const [query, setQuery] = useState('');
    //useState per i risultati del fetch
    const [results, setResults] = useState([]);

    //definisco la funzione debounce perché il fetch deve essere eseguito solo dopo un certo tempo
    //imposto come argomenti callback (la funzione da eseguire DOPO il ritardo) e delay (il tempo di attesa)
    function debounce(callback, delay) {
        //creo una variabile per il timeout
        let timeout;
        return (...query) => {
            //il timer viene resettato prima che il tempo sia scaduto se la funzione viene richiamata
            clearTimeout(timeout);
            //imposto un nuovo timer che aspetta tot millisecondi e poi chiama la funzione di callback. il timer viene memorizzato in timeout, così può essere annullato alla prossima chiamata
            timeout = setTimeout(() => {
                callback(...query);
            }, delay);
        }
    }

    //definisco la funzione eseguiFetch. uso useCallback per evitare il loop di useEffect ogni volta che l'utente digita, e inserisco il debounce. ho inserito query come argomento per poterlo usare nella funzione
    //il fetch parte dopo 1 secondo che l'utente ha smesso di digitare (query è "inattivo")
    //senza la useCallback il fetch viene eseguito ogni volta che l'utente digita nell'input, e React crea una nuova versione di eseguiFetch, INVALIDANDO IL DEBOUNCE
    const eseguiFetch = useCallback(debounce((query) => {
        fetch(`https://localhost:3333/products?search=${query}`)
            .then(response => response.json())
            .then(data => setResults(data))
            .catch(error => console.log(error));
    }, 1000), []);

    useEffect(() => {
        //se query è vuota, i risultati vengono resettati
        if (query === "") {
            setResults([]);
            return;
        }
        //altrimenti, eseguo il fetch (che aspetta 1 secondo prima di farlo)
        eseguiFetch(query);
    //c'è query come dipendenza perché ogni volta che cambia, deve scattare qualcosa (svuotare o fare il fetch)
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
            {/* se query è true (ovvero se l'utente ha digitato qualcosa) e results.length > 0 (ovvero se ci sono risultati) mostra i risultati tramite il map */}
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