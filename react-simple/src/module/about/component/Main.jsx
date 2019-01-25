import React from "react";
import { connect } from "react-redux";

class Main extends React.PureComponent {
  render() {
    console.info(this.props);
    return (
      <div>
        {this.props.name}
        <button
          onClick={() =>
            this.props.dispatch({
              type: "setState",
              name: "about",
              payload: {
                name: "new about"
              }
            })
          }
        >
          change
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    name: state.app.about.name
  };
};

export default connect(mapStateToProps)(Main);
