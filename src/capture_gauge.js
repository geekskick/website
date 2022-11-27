import GaugeChart from "react-gauge-chart";
import React from 'react';


export class CaptureGuage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            max_level: 255
        };
    }

    toPercentage(rate) {
        try {
            const rc = rate / this.state.max_level;
            console.log("Capture Rate " + rate + " as a percentage is " + rc);
            return rc;
        }
        catch (error) {
            this.props.onError(error);
        }
    }

    fromPercentage(rate) {
        try {
            const rc = parseInt(this.state.max_level * (rate / 100), 10);
            console.log("Percentage " + rate + " as a rate is " + rc);
            return rc;
        } catch (error) {
            this.props.onError(error);
        }
    }

    render() {
        const chartStyle = {
            height: 250,
        }
        let gauge;
        console.log("rendering CaptureGuage");

        if (this.props.rate) {
            gauge = <GaugeChart
                style={chartStyle}
                nrOfLevels={this.state.max_level / 10}
                percent={this.toPercentage(this.props.rate)}
                formatTextValue={value => this.fromPercentage(value)}
                colors={["#ff0000", "#00ff00"]}
                animDelay={0}
                animateDuration={1000}
                textColor="#000000"
                arcWidth={0.3} />;
        }
        else {
            gauge = <GaugeChart
                style={chartStyle}
                nrOfLevels={this.state.max_level / 10}
                animDelay={0}
                percent={0.50}
                formatTextValue={value => "No rate available"}
                colors={["#808080"]}
                animateDuration={1000}
                textColor="#000000"
                arcWidth={0.3} />;
        }
        return (
            <div>
                {/*<p>{this.props.mon}</p>*/}
                {gauge}
            </div>)
    }
}

