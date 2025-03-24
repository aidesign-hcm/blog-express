import algoliasearch from "algoliasearch/lite";
import {
  Hits,
  InstantSearch,
  SearchBox,
  Configure,
  useInstantSearch,
} from "react-instantsearch";
import { Hit, HitNav } from "@/components/Navigation/SearchResult";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from 'next/navigation';


const algoliaClient = algoliasearch(
  "TB5I447CYJ",
  `${process.env.ANGOLIA_SERET}`
);
const searchClient = {
  ...algoliaClient,
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: "",
          params: "",
          setIsOpen: false,
        })),
      });
    }
    return algoliaClient.search(requests);
  },
};

export const Search = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="az_posts_post">
      <Configure hitsPerPage={12} />
      <div className="ais-InstantSearch">
        <SearchBox
          className="searchbox"
          placeholder="Tìm kiếm?"
        />
          <div className="search-results relative">
            <Hits hitComponent={Hit} />
          </div>
      </div>
    </InstantSearch>
  );
};

export const NavSearch = () => {
  const [showHits, setShowHits] = useState(false);
  const searchContainerRef = useRef(null);
  const pathname = usePathname();
  const [query, setQuery] = useState('2222');

  const handleClickOutside = () => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
      setShowHits(false)
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
   useEffect(() => {
    setQuery('');
    setShowHits(false)
  }, [pathname]);
  return (
    <>
    <InstantSearch searchClient={searchClient} indexName="az_posts_post">
      <Configure hitsPerPage={12} />
      <div className="ais-InstantSearch" ref={searchContainerRef}>
        <SearchBox
          onFocus={() => setShowHits(true)}
          className="searchbox"
          placeholder="Tìm Kiếm"
          value={query} // Bind input value to query state
        />
        <div className="search-results relative">
        {showHits ? <Hits hitComponent={HitNav} /> : null}
        </div>
      </div>
    </InstantSearch>
    
    </>
  );
};
