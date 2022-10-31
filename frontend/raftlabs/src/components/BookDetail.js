
import classes from "./BookDetail.module.css"

const BookDetail =(props)=>{
  return (
    <div>
      <ul>
        <li className={classes.list}>Title : {props.details.title}</li>
        <li className={classes.list}>isbn : {props.details.isbn}</li>
        <li className={classes.list}>
          description : {props.details.description}
        </li>
      </ul>
    </div>
  );
}

export default BookDetail