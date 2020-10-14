import React from "react";
import "./App.css";
import Course from "./Course";

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];
    if (Array.isArray(this.props.data)) {
      for (let i = 0; i < this.props.data.length; i++) {
        let req = this.checkRequisites(this.props.data[i]);
        courses.push(
          <Course
            key={i}
            data={this.props.data[i]}
            courseKey={this.props.data[i].number}
            addCartCourse={(data) => this.props.addCartCourse(data)}
            removeCartCourse={(data) => this.props.removeCartCourse(data)}
            cartCourses={this.props.cartCourses}
            reqMessage={req}
          />
        );
      }
    } else {
      for (const course of Object.keys(this.props.data)) {
        courses.push(
          <Course
            key={this.props.data[course].number}
            data={this.props.data[course]}
            courseKey={this.props.data[course].number}
            addCartCourse={(data) => this.props.addCartCourse(data)}
            removeCartCourse={(data) => this.props.removeCartCourse(data)}
            cartCourses={this.props.cartCourses}
          />
        );
      }
    }
    return courses;
  }
  checkRequisites(course) {
    var requisiteArray = [];
    var requisiteString = "";
    var requisiteStringArray = [];
    var incompleteRequisites = [];
    for (let i = 0; i < course.requisites.length; i++) {
      requisiteArray.push(course.requisites[i]);
      for (let j = 0; j < course.requisites[i].length; j++) {
        if (j !== course.requisites[i].length - 1) {
          requisiteString = requisiteString + course.requisites[i][j] + " or ";
        } else {
          requisiteString = requisiteString + course.requisites[i][j];
          requisiteStringArray.push(requisiteString);
          requisiteString = "";
        }
      }
    }
    var compCourses = [];
    for (let i = 0; i < this.props.completed.length; i++) {
      compCourses.push(this.props.completed[i]);
    }

    for (let i = 0; i < course.requisites.length; i++) {
      if (compCourses.some((r) => course.requisites[i].indexOf(r) >= 0)) {
        continue;
      } else {
        incompleteRequisites.push(requisiteStringArray[i]);
      }
    }
    var returnString =
      "You may still add to cart, but must first take prerequisites: ";
    if (incompleteRequisites.length !== 0) {
      for (let i = 0; i < incompleteRequisites.length; i++) {
        if (i !== incompleteRequisites.length - 1) {
          returnString =
            returnString + "(" + incompleteRequisites[i] + ") AND ";
        } else {
          returnString = returnString + "(" + incompleteRequisites[i] + ")";
          return returnString;
        }
      }
    } else {
      return "";
    }
  }
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  render() {
    return <div style={{ margin: 5, marginTop: -5 }}>{this.getCourses()}</div>;
  }
}

export default CourseArea;
