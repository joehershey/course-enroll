import React from "react";
import "./App.css";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
//import FilterRecs from "./FilterRecs";

class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.rating = React.createRef();
    //this.filterRecs = new FilterRecs();
  }
  render() {
    return (
      <div>
        <Form.Group controlId="formRating">
          <Form.Control
            as="select"
            ref={this.rating}
            onChange={() => this.setRecs()}
          >
            {this.getRatingOptions()}
          </Form.Control>
        </Form.Group>
      </div>
    );
  }
  getRatingOptions() {
    let ratingOptions = [];
    let one = "\u2605";
    let two = one + one;
    let three = two + one;
    let four = three + one;
    let five = four + one;
    ratingOptions.push(<option key={0}>No Rating</option>);
    ratingOptions.push(<option key={1}>{one}</option>);
    ratingOptions.push(<option key={2}>{two}</option>);
    ratingOptions.push(<option key={3}>{three}</option>);
    ratingOptions.push(<option key={4}>{four}</option>);
    ratingOptions.push(<option key={5}>{five}</option>);
    return ratingOptions;
  }
  setRecs() {
    if (this.rating.current != null) {
      console.log(this.rating.current.value);
      if (this.rating.current.value !== "No Rating") {
        if (this.rating.current.value.length === 1) {
          this.props.rating(1, this.props.completed);
        }
        if (this.rating.current.value.length === 2) {
          this.props.rating(2, this.props.completed);
        }
        if (this.rating.current.value.length === 3) {
          this.props.rating(3, this.props.completed);
        }
        if (this.rating.current.value.length === 4) {
          this.props.rating(4, this.props.completed);
        }
        if (this.rating.current.value.length === 5) {
          this.props.rating(5, this.props.completed);
        }
      } else {
        this.props.rating(this.rating.current.value, this.props.completed);
      }
    }
  }
}

export default Rating;
