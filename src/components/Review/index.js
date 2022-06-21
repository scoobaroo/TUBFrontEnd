import React from "react";
import {
  TextField,
  Button,
  ProgressCircle,
  TextArea,
} from "@adobe/react-spectrum";
import ReactStars from "react-rating-stars-component";


const Reviews = (props) => {
  return (
    <div>
      <h3>Review</h3>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <ReactStars
          count={5}
          onChange={(newRating) => props.ratingChangeHandler(newRating)}
          size={26}
          fullIcon={<i className="fa fa-star"></i>}
          activeColor="#ffd700"
        />
        <TextField
          placeholder="Tittle"
          width={"100%"}
          onChange={props.ratingNameHandler}
        />
        <TextArea
          placeholder="Comment"
          width={"100%"}
          onChange={props.ratingDiscriptionHandler}
        />
        <Button onPress={() => props.bountyRatingHandler(props.bountyDetails)}>
          {props.loader && (
            <div>
              {" "}
              <ProgressCircle aria-label="Loading…" isIndeterminate />
            </div>
          )}
          submit
        </Button>
      </div>
    </div>
  );
};

export default Reviews;
