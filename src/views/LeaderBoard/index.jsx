import React, { Component } from "react";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

class LeaderBoardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Leader Board",
      apiUrl: "https://mixpanel.com/api/2.0/events/properties?",
      param: "type=general&name=driver&event=Touch Me&",
      isLoading: true,
      currentDriver: localStorage.getItem("email"),
      drivers: [],
      value: ""
    };
    //get all drivers and their count
    this.getAllDrivers(this.state.value);
  }

  //to fetch drivers data
  getAllDrivers(...props) {
    const apiUrl = this.state.apiUrl;
    const param = this.state.param;
    let dateParams = "";
    if (props[0].length > 0) {
      if (props[0] === "lifetimeCount") {
        dateParams = "unit=year&interval=10";
      } else {
        dateParams = "unit=day&interval=6&from_date=" + props[0];
      }
    } else {
      dateParams = "unit=week";
    }

    fetch(apiUrl + param + dateParams, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic " + process.env.REACT_APP_MIXPANEL_BASIC_AUTH_KEY
      }
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        let values = res.data.values;
        let drivers = [];
        let totalCount = 0;
        Object.keys(values).forEach(key => {
          Object.keys(values[key]).forEach(date => {
            totalCount += values[key][date];
          });
          drivers.push({ email: key, count: totalCount });
          totalCount = 0;
        });
        drivers.sort(this.sortByProperty("count"));
        this.setState({ drivers: drivers });
        this.setState({ isLoading: false });
      });
  }

  //sorting of data fetched by property "count" in descending order
  sortByProperty(count) {
    return function(x, y) {
      return y[count] - x[count];
    };
  }

  //to mask email address
  emailMasking(email) {
    return (
      email.substring(0, 1) + "***" + email.substring(email.indexOf("@") - 1)
    );
  }

  //to handle change on selecting option from dropdown menu
  handleChange(e) {
    let dateValue = e.target.value;
    this.setState({ value: dateValue });
    this.setState({ isLoading: true });
    this.getAllDrivers(dateValue);
  }

  //to find date on last Monday
  findLastMonday() {
    let prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
    return prevMonday;
  }

  //to formate date(yyyy-mm-dd)
  formatDate(date) {
    let d = date,
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

  //to create options for dropdown menu
  createOptions() {
    let prevMonday = this.findLastMonday();
    let formattedDate = prevMonday.toISOString().slice(0, 10);
    let options = [<option value={formattedDate} key={1}>Current week</option>];

    //to create options for last 10 weeks
    for (let i = 0; i < 10; i++) {
      prevMonday.setDate(prevMonday.getDate() - 7);
      formattedDate = this.formatDate(prevMonday);
      options.push(<option value={formattedDate} key={i + 2}>{formattedDate}</option>);
    }

    //this option will display lifetime count
    options.push(<option value="lifetimeCount" key={12}>Lifetime count</option>);
    return options;
  }

  //to count days left for weekly competition
  daysLeft() {
    let today = new Date();
    let days = 7 - ((today.getDay() + 6) % 7);
    return days;
  }

  //to create table row
  createRow(key, email, count, isTbaleHeader) {
    return (
      <div className="tableRow"
        style={{
        backgroundColor:
          this.state.currentDriver === email
            ? "rgba(180, 197, 249)"
              : "",
          fontWeight: isTbaleHeader ? "bold" : ""
      }}>
        <div className="rowContent columnOne">{key}</div>
        <hr />
        <div className="rowContent columnTwo">
          {email}
        </div>
        <hr />
        <div className="rowContent columnThree">
          {count}
        </div>
      </div>
    )
  }

  render = () => {
    if (this.state.isLoading) {
      return <Loading />;
    } else {
      return (
        <div>
          <Header title={this.state.title} />
          <div className="lb-form-content">
            Select week:
            <select value={this.state.value} onChange={e => this.handleChange(e)}>
              {this.createOptions()}
            </select>
            <p>{this.daysLeft()} day(s) left for this week competition</p>
          </div>
          <div className="tableContainer">
            {this.createRow("#", "Email Addresses", "# of Events", true)}
            {this.state.drivers.map((driver, index) => {
              return this.createRow(index+1, driver.email, driver.count);
            })}
          </div>
        </div>
      );
    }
  };
}

export default LeaderBoardPage;