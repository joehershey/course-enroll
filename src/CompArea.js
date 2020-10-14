import React from "react";
import "./App.css";
import CompCourse from "./CompCourse";

class CompArea extends React.Component {
  getCourses() {
    let courses = [];
    if (Array.isArray(this.props.data)) {
      for (let i = 0; i < this.props.data.length; i++) {
        let course = this.props.fullCourses(this.props.data[i]);
        courses.push(
          <CompCourse
            data={course}
            courseKey={course.number}
            courses={this.props.courses}
            //setRecs={(recs) => this.setRecCourses(recs)}
            setRate={(rate, comp) => this.setRate(rate, comp)}
          />
        );
      }
    }
    return courses;
  }

  setRecCourses(recs) {
    this.props.setRecCourses(recs);
  }

  setRate(rate, comp) {
    this.props.setRate(rate, comp);
  }

  render() {
    return <div style={{ margin: 5, marginTop: -5 }}>{this.getCourses()}</div>;
  }
}

export default CompArea;
