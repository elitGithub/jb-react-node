import { VictoryBar, VictoryChart, VictoryTheme } from "victory";
import { Fragment } from "react";

const Chart = (props) => {

  return(<Fragment>
      <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={10}
      >
          <VictoryBar
              style={{ data: { fill: "#c43a31" } }}
              data={props.data}
              // data accessor for x values
              x={props.x}
              // data accessor for y values
              y={props.y}
          />
      </VictoryChart>

  </Fragment>);
}

export default Chart;