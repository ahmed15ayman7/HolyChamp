import { VictoryChart, VictoryLine, VictoryAxis, VictoryTooltip, VictoryLegend } from 'victory';

interface ReadingProgressChartProps {
  data: number[];
}

const ReadingProgressChart = ({ data }: ReadingProgressChartProps) => {
  const chartData = [
    { day: 'Day 1', pagesRead: data[0] },
    { day: 'Day 2', pagesRead: data[1] },
    { day: 'Day 3', pagesRead: data[2] },
    { day: 'Day 4', pagesRead: data[3] },
    { day: 'Day 50', pagesRead: data[4] },
  ];

  return (
    <VictoryChart domainPadding={20}>
      <VictoryAxis
        tickValues={['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5']}
        tickFormat={['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5']}
      />
      <VictoryAxis dependentAxis />
      
      <VictoryLine
        data={chartData}
        x="day"
        y="pagesRead"
        style={{
          data: { stroke: "#4BC0C0", strokeWidth: 3 },
          labels: { fontSize: 10 },
        }}
        labels={({ datum }) => `${datum.pagesRead} pages`}
        labelComponent={<VictoryTooltip />}
      />
      
      <VictoryLegend
        x={100}
        y={50}
        title="Pages Read"
        centerTitle
        orientation="horizontal"
        gutter={20}
        style={{ labels: { fontSize: 12, fill: "#1E3A8A" } }}
      />
    </VictoryChart>
  );
};

export default ReadingProgressChart;
