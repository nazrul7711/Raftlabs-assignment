import { useState } from "react";

const AddBook = () => {
  const [enteredTitle, setTitle] = useState("");
  const [enteredIsbn, setIsbn] = useState("");
  const [enteredAuthors, setAuthors] = useState("");
  const [enteredDescription, setDescription] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    let response = await fetch("http://localhost:3000/addBook", {
      method: "POST",
      body: JSON.stringify({
        title: enteredTitle,
        isbn: enteredIsbn,
        authors: enteredAuthors,
        description: enteredDescription,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // const data = await response.json()
    if (response.status === 200) {
      alert("book added successfully");
    } else {
      alert(
        "either book title already exist or the isbn already exist or author is not registed"
      );
    }
    setTitle("");
    setIsbn("");
    setAuthors("");
    setDescription("");
  };

  return (
    <>
    <h3>Add Book</h3>
      <form onSubmit={submitHandler}>
        <label>Title</label>
        <input
          type="text"
          placeholder="Title"
          value={enteredTitle}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <label>ISBN</label>
        <input
          type="text"
          placeholder="ISBN"
          value={enteredIsbn}
          onChange={(e) => {
            setIsbn(e.target.value);
          }}
        />
        <label>Authors</label>
        <input
          type="text"
          placeholder="Authors"
          value={enteredAuthors}
          onChange={(e) => {
            setAuthors(e.target.value);
          }}
        />
        <label>Description</label>
        <input
          type="text"
          value={enteredDescription}
          placeholder="description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default AddBook;
