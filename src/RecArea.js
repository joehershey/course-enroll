import React from "react";
import "./App.css";
import RecCourse from "./RecCourse";

class RecArea extends React.Component {
  getCourses() {
    let courses = [];
    if (Array.isArray(this.props.recs)) {
      for (let i = 0; i < this.props.recs.length; i++) {
        let interest = this.getInterest(this.props.recs[i]);
        courses.push(
          <RecCourse
            data={this.props.recs[i]}
            courseKey={this.props.recs[i].number}
            courses={this.props.courses}
            interests={interest}
          />
        );
      }
    }
    return courses;
  }

  getInterest(course) {
    var sharedInterest;
    var courseInterests = course.keywords;
    courseInterests.push(course.subect);
    for (let i = 0; i < this.props.interests.length; i++) {
      for (let j = 0; j < courseInterests.length; j++)
        if (this.props.interests[i] === courseInterests[j]) {
          sharedInterest = this.props.interests[i];
          return sharedInterest;
        }
    }
    return "ERROR ON SHARED INTEREST";
  }

  render() {
    return <div style={{ margin: 5, marginTop: -5 }}>{this.getCourses()}</div>;
  }
}

export default RecArea;
