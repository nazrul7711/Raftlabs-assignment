
import classes from "./App.module.css"
import { useState } from 'react';
import BookDetail from './components/BookDetail';
import AddMagazine from './components/AddMagazine';
import AddBook from './components/AddBook';


function App() {
  const [bookData, setBookData] = useState([]);

  const getDataHandler=async()=>{  
    let response = await fetch("http://localhost:3000/allDetails", {
      method: "GET",
    });
    const data = await response.json();
    setBookData(data);


  }
  return (
    <div className="App">
      <AddMagazine/>
      <AddBook/>
      <h2>Press this button to get the details of all books and magazines sorted by title</h2>
      <button className={classes.btn} onClick={getDataHandler}>Press</button>
      {bookData.map(book=>(
        <BookDetail details = {book}/>
      ))}
    </div>
  );
}

export default App;
