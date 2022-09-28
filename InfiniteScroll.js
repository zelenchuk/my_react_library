import React, {useState, useEffect} from 'react';

const useInfiniteScroll = (callback) => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        callback();
    }, [isFetching]);

    function handleScroll() {
        let limit = Math.max(document.body.scrollHeight, document.body.offsetHeight,
            document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

        console.log("User scrolled down: ", limit === (window.innerHeight + document.documentElement.scrollTop));

        if (limit !== (window.innerHeight + document.documentElement.scrollTop) || isFetching) return;
        setIsFetching(true);
    }

    return [isFetching, setIsFetching];
};


const List = () => {
    const [listItems, setListItems] = useState(Array.from(Array(30).keys(), n => n + 1));
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

    function fetchMoreListItems() {
        setTimeout(() => {
            setListItems(prevState => ([...prevState, ...Array.from(Array(20).keys(), n => n + prevState.length + 1)]));
            setIsFetching(false);
        }, 2000);
    }

    return (
        <>
            <ul className="list-group mb-2">
                {listItems.map(listItem => <li className="list-group-item">List Item {listItem}</li>)}
            </ul>
            {isFetching && 'Fetching more list items...'}
        </>
    );
};


export default List;
