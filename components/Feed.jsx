"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  // console.log(data);
  return (
    <div className="mt-16 prompt_layout">
      {data.length > 0 &&
        data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedPosts, setSearchPosts] = useState([]);

  const [posts, setPosts] = useState([]);

  //Filter the posts by search text
  const filterPrompts = (searchText) => {
    // "i" ignore case sensitive
    const regex = new RegExp(searchText, "i");
    console.log(regex);
    return posts.filter(
      (post) =>
        //.test() will return a boolean value if the regex match the word
        regex.test(post.tag) ||
        regex.test(post.creator.username) ||
        regex.test(post.prompt)
    );
  };
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    //set timeout to limit search function run every time we type, setting timeout limit it to search only when we stop typing after 0.5sec
    setSearchTimeout(
      setTimeout(() => {
        //run search function after stop typing for 0.5 sec
        const searchResults = filterPrompts(e.target.value);
        setSearchPosts(searchResults);
        console.log(searchResults);
      }, 500)
    );
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);

    //run search function right after clicking on the tag
    const searchResults = filterPrompts(tag);
    setSearchPosts(searchResults);
  };
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center max-w-xl">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* check if the search tab is empty or not, if not display the searched posts */}
      <PromptCardList
        data={searchText ? searchedPosts : posts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
