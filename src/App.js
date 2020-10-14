import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";
import CompArea from "./CompArea";
import RecArea from "./RecArea";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      interests: [],
      cartCourses: {},
      previousCourses: [],
      compCourses: [],
      recCourses: [],
      highlyRated: [],
      recInterests: [],
    };
  }

  componentDidMount() {
    this.loadInitialState();
  }

  async loadInitialState() {
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json();
    let prevCourseURL =
      "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let prevCourseData = await (await fetch(prevCourseURL)).json();

    this.setState({
      allCourses: courseData,
      filteredCourses: courseData,
      previousCourses: prevCourseData.data,
      subjects: this.getSubjects(courseData),
      interests: this.getInterests(courseData),
    });
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (let i = 0; i < data.length; i++) {
      if (subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  getInterests(data) {
    let interests = [];
    interests.push("All");
    for (let i = 0; i < data.length; i++) {
      if (interests.indexOf(data[i].subject) === -1)
        interests.push(data[i].subject);
    }
    var usedKeywords = [];
    for (const course of data) {
      for (const keyword of course.keywords) {
        if (usedKeywords.indexOf(keyword) < 0) {
          usedKeywords.push(keyword);
          interests.push(keyword);
        }
      }
    }
    return interests;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  getCompCourses(course) {
    var compCourse = [];

    for (let j = 0; j < this.state.allCourses.length; j++) {
      if (course === this.state.allCourses[j].number) {
        compCourse = this.state.allCourses[j];
      }
    }

    return compCourse;
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses)); // I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {
      return x.number === data.course;
    });
    if (courseIndex === -1) {
      return;
    }

    if ("subsection" in data) {
      if (data.course in this.state.cartCourses) {
        if (data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        } else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    } else if ("section" in data) {
      if (data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      }
    } else {
      newCartCourses[data.course] = {};

      for (
        let i = 0;
        i < this.state.allCourses[courseIndex].sections.length;
        i++
      ) {
        newCartCourses[data.course][i] = [];

        for (
          let c = 0;
          c < this.state.allCourses[courseIndex].sections[i].subsections.length;
          c++
        ) {
          newCartCourses[data.course][i].push(
            this.state.allCourses[courseIndex].sections[i].subsections[c]
          );
        }
      }
    }
    this.setState({ cartCourses: newCartCourses });
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses));

    if ("subsection" in data) {
      newCartCourses[data.course][data.section].splice(
        newCartCourses[data.course][data.section].indexOf(data.subsection),
        1
      );
      if (newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else if ("section" in data) {
      delete newCartCourses[data.course][data.section];
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else {
      delete newCartCourses[data.course];
    }
    this.setState({ cartCourses: newCartCourses });
  }

  getCartData() {
    let cartData = [];

    for (const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {
        return x.number === courseKey;
      });

      cartData.push(course);
    }
    return cartData;
  }

  setRecCourses(newRecs) {
    var interests = [];
    var usedKeywords = [];
    for (const course of newRecs) {
      if (interests.indexOf(course.subject) == -1) {
        interests.push(course.subject);
      }
      for (const course of newRecs) {
        for (const keyword of course.keywords) {
          if (usedKeywords.indexOf(keyword) == -1) {
            usedKeywords.push(keyword);
            interests.push(keyword);
          }
        }
      }
    }
    var newRecCourses = [];
    var courseInterests = [];
    for (const course of this.state.allCourses) {
      courseInterests = course.keywords;
      courseInterests.push(course.subject);
      if (interests.some((r) => courseInterests.indexOf(r) >= 0)) {
        for (let i = 0; i < this.state.previousCourses.length; i++) {
          if (course.number !== this.state.previousCourses[i]) {
            if (i === this.state.previousCourses.length - 1) {
              newRecCourses.push(course);
            }
          } else {
            break;
          }
        }
      }
    }
    this.setState({ recInterests: interests });
    this.setState({ recCourses: newRecCourses });
  }

  setRate(rate, comp) {
    var newHighlyRated = this.state.highlyRated;
    var newlyRated = JSON.parse(JSON.stringify(comp));
    if (rate !== "No Rating" && rate >= 3) {
      newHighlyRated.push(newlyRated);
      this.setState({ highlyRated: newHighlyRated });
    } else {
      for (let i = 0; i < newHighlyRated.length; i++) {
        if (newHighlyRated[i].number === newlyRated.number) {
          newHighlyRated.splice(i, 1);
          this.setState({ highlyRated: newHighlyRated });
          break;
        }
      }
    }
    this.setRecCourses(this.state.highlyRated);
  }

  render() {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs
          defaultActiveKey="search"
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Tab eventKey="search" title="Search" style={{ paddingTop: "5vh" }}>
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
              interests={this.state.interests}
            />
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.filteredCourses}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
                completed={this.state.previousCourses}
              />
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.getCartData()}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
                completed={this.state.previousCourses}
              />
            </div>
          </Tab>
          <Tab
            eventKey="completed"
            title="Completed Courses"
            style={{ paddingTop: "5vh" }}
          >
            <div style={{ marginLeft: "20vw" }}>
              <CompArea
                //setRecCourses={(courses) => this.setRecCourses(courses)}
                courses={this.state.allCourses}
                data={this.state.previousCourses}
                fullCourses={(a) => this.getCompCourses(a)}
                setRate={(rate, comp) => this.setRate(rate, comp)}
              />
            </div>
          </Tab>
          <Tab
            eventKey="reccomended"
            title="Reccomended Courses"
            style={{ paddingTop: "5vh" }}
          >
            <div style={{ marginLeft: "20vw" }}>
              <RecArea
                data={this.state.highlyRated}
                recs={this.state.recCourses}
                completed={this.state.previousCourses}
                courses={this.state.allCourses}
                interests={this.state.recInterests}
              />
            </div>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default App;
