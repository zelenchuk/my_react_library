import { useEffect, useState } from "react";

// References:
// https://dev.to/jackzhoumine/comment/1h9c8

// CodesandBox link:
// https://codesandbox.io/s/react-debounced-data-fetching-input-630jk?file=/pages/with-use-debounce-custom-hook.js

const API_ENDPOINT = "https://jsonplaceholder.typicode.com/todos/1";
const DEBOUNCE_DELAY = 1500;

export default function DebouncedInput() {
  const [queryResults, setQueryResults] = useState(null);
  const [isDebounced, setIsDebounced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [didMount, setDidMount] = useState(false);
  const [userInput, setUserInput] = useState(null);
  const debouncedUserInput = useDebounce(userInput, DEBOUNCE_DELAY);

  useEffect(() => {
    if (!didMount) {
      // required to not call API on initial render
      //https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
      setDidMount(true);
      return;
    }
    fetchQuery(debouncedUserInput);
  }, [debouncedUserInput]);

  function handleUserInputChange(event) {
    setUserInput(event.target.value);
    setIsDebounced(true);
  }

  function fetchQuery(debouncedUserInput) {
    setIsLoading(true);
    setIsDebounced(false);

    console.log("debouncedUserInput: " + debouncedUserInput);

    fetch(API_ENDPOINT)
      .then((res) => res.json())
      .then((json) => {
        setQueryResults(json);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }

  const DisplayResponse = () => {
    if (isDebounced) {
      return <p>fetchQuery() is debounced for {DEBOUNCE_DELAY}ms</p>;
    } else if (isLoading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <pre style={{ color: "red" }}>{error.toString()}</pre>;
    } else if (queryResults) {
      return (
        <pre>
          Server response:
          <br />
          {JSON.stringify(queryResults)}
        </pre>
      );
    }
    return null;
  };

  return (
    <main>
      <h1>
        With <em>useDebounce</em> custom hook
      </h1>
      <a href="/">Try with Lodash Debounce instead</a>
      <div className="input-container">
        <label htmlFor="userInput">Type here:</label>
        <input
          type="text"
          id="userInput"
          autoComplete="off"
          placeholder={"input is delayed by " + DEBOUNCE_DELAY}
          onChange={handleUserInputChange}
        />
      </div>
      <DisplayResponse />
    </main>
  );
}

function useDebounce(value, wait = 500) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, wait);
    return () => clearTimeout(timer); // cleanup when unmounted
  }, [value, wait]);

  return debounceValue;
}
