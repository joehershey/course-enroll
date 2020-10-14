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
      <Form.Group controlId="formRating">
        <Form.Control
          as="select"
          ref={this.rating}
          onChange={() => this.setRecs()}
        >
          {this.getRatingOptions()}
        </Form.Control>
      </Form.Group>
    );
  }
  getRatingOptions() {
    let ratingOptions = [];
    ratingOptions.push(<option key={0}>No Rating</option>);
    ratingOptions.push(<option key={1}>1</option>);
    ratingOptions.push(<option key={2}>2</option>);
    ratingOptions.push(<option key={3}>3</option>);
    ratingOptions.push(<option key={4}>4</option>);
    ratingOptions.push(<option key={5}>5</option>);
    return ratingOptions;
  }
  setRecs() {
    if (this.rating.current != null) {
      this.props.rating(this.rating.current.value, this.props.completed);
    }
  }
}

export default Rating;
