"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import searchNotes from '@/API/SearchNotes'
import { removeStopwords } from 'stopword'
import ReactMarkdown from 'react-markdown'
import BeatLoader from "react-spinners/BeatLoader";
import { data } from './utils';

const chrono = require('chrono-node');

export default function Dashboard() {
  let [searchQuery, setSearchQuery] = useState('');
  let [searchResults, setSearchResults] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    // Parse the date from the search query
    let parsedResults = chrono.parse(searchQuery);

    // If a date was found, remove it from the search query
    if (parsedResults.length > 0) {
      const dateIndex = parsedResults[0].index;
      const dateLength = parsedResults[0].text.length;

      // Remove the date from the search query
      searchQuery = searchQuery.slice(0, dateIndex) + searchQuery.slice(dateIndex + dateLength);
    }

    // Split the modified search query into words
    const words = searchQuery.split(' ');

    // Filter out the stop words
    const keywords = removeStopwords(words);

    const results = await searchNotes(keywords.join(' '));
    setSearchResults(results);
    setIsLoading(false);
  };  

  return (
    <>
        <div className="w-[80%] flex flex-col mx-auto my-24 gap-24">
            <div className="flex flex-col gap-4">
                <h1 className="text-5xl font-bold">Dashboard</h1>
                <form onSubmit={handleSearch} className="flex flex-row gap-2 rounded-full bg-[#252525] p-1 max-w-[30rem] min-w-[10rem]">
                    <img className="px-1"src="search.svg" alt="yo"></img>
                    <input 
                    type="text" 
                    placeholder="Search" 
                    className="bg-transparent text-white w-full outline-none"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    />                
                </form>
            </div>
            {isLoading ? (
              <BeatLoader color="#ffffff" />
            ) : hasSearched ? (
              searchResults.map((result, index) => {
                return (
                    <Card key={index} className="w-[22rem] h-[18rem] bg-[#181818]">
                        <CardHeader>
                            <CardTitle>{result.section_title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ReactMarkdown>{result.section_content}</ReactMarkdown>
                        </CardContent>
                    </Card>
                );
              })
            ) : (
              Object.entries(data).map(([key, value]) => {
                return (
                  <div key={key}>
                    <h2>{key}</h2>
                    {value.cards.map((card, index) => (
                      <Card key={index} className="w-[22rem] h-[18rem] bg-[#181818]">
                        <CardHeader>
                          <CardTitle>{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ReactMarkdown>{card.description}</ReactMarkdown>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                );
              })
            )}
        </div>
    </>
  );
}