import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import {
  FilteringState,
  GroupingState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState
} from "@devexpress/dx-react-grid";
import {
  DragDropProvider,
  Grid,
  GroupingPanel,
  PagingPanel,
  Table,
  TableFilterRow,
  TableGroupRow,
  TableHeaderRow,
  TableSelection,
  TableFixedColumns,
  TableColumnVisibility,
  Toolbar,
  ColumnChooser,
  //VirtualTable,
  TableColumnResizing,
  TableColumnReordering
} from "@devexpress/dx-react-grid-material-ui";
import {
  generateRows,
  globalSalesValues,
} from '../../../demo-data/generator';

const sales = generateRows({ columnValues: globalSalesValues, length: 100 });

const useStyles = makeStyles({
  currency: {
    fontWeight: 14
  },
  numericInput: {
    fontSize: "14px",
    width: "100%"
  },
  shipped: {
    color: "green"
  },
  notShipped: {
    color: "red",
    opacity: 0.6
  },
  pagingBugFix: {
    "& .MuiInputBase-root": {
      fontSize: "0.75rem",
      paddingTop: 0,
      "& .MuiInputBase-inputMarginDense": {
        paddingTop: 7
      }
    }
  },
  filtersRoot: {
    width: "100%",
    padding: "0.75rem",
    marginTop: 0,
    backgroundColor: "#e0e0e0"
  },
  filtersWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "0.25rem 0.5rem"
  },
  containerBugFix: {
    overflow: "unset"
  }
});

const initialState = {
  sorting: { title: "Sorting", enabled: true },
  paging: { title: "Paging", enabled: true },
  filtering: { title: "Filtering", enabled: true },
  grouping: { title: "Grouping", enabled: true },
  selection: { title: "Row Selection", enabled: true },
  columnReordering: { title: "Column Reordering", enabled: true },
  columnResizing: { title: "Column Resizing", enabled: true },
  columnVisibility: { title: "Column Visibility", enabled: true },
  fixedColumns: { title: "Fixed Columns", enabled: true }
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE": {
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          enabled: !state[action.name].enabled
        }
      };
    }
    default:
      throw new Error("Action not declared");
  }
}

const tableColumnExtensions = [
  { columnName: "region", width: 200 },
  { columnName: "sector", width: 200 },
  { columnName: "channel", width: 200 },
  { columnName: "product", width: 260 },
  { columnName: "customer", width: 260 },
  { columnName: "saleDate", width: 150 },
  { columnName: "units", width: 80, align: "right" },
  { columnName: "subject", width: 680 },
  { columnName: "shipped", align: "center" },
  { columnName: "discount", align: "right" },
  { columnName: "amount", align: "right", width: 140 }
];

const defaultColumnWidths = [
  { columnName: "region", width: 200 },
  { columnName: "sector", width: 200 },
  { columnName: "channel", width: 200 },
  { columnName: "product", width: 260 },
  { columnName: "customer", width: 260 },
  { columnName: "saleDate", width: 150 },
  { columnName: "units", width: 120 },
  { columnName: "subject", width: 680 },
  { columnName: "shipped", width: 100 },
  { columnName: "discount", width: 120 },
  { columnName: "amount", width: 140 }
];

export default () => {
  const [columns] = React.useState([
    { name: "product", title: "Product" },
    { name: "region", title: "Region" },
    { name: "sector", title: "Sector" },
    { name: "channel", title: "Channel" },
    { name: "units", title: "Units" },
    { name: "amount", title: "Sale Amount" },
    { name: "discount", title: "Discount" },
    { name: "saleDate", title: "Sale Date" },
    { name: "customer", title: "Customer" },
    { name: "subject", title: "Subject" },
    { name: "shipped", title: "Shipped" }
  ]);

  const [rows] = React.useState(sales);
  const [currencyColumns] = React.useState(["amount"]);
  const [booleanColumns] = React.useState(["shipped"]);

  const [enabledFeatures, dispatch] = React.useReducer(reducer, initialState);
  const classes = useStyles();
  const handleChange = feature => e => {
    dispatch({ type: "TOGGLE", name: feature });
  };

  return (
    <Box p={3}>
      <Paper>
        <FormControl component="div" className={classes.filtersRoot}>
          <h4>Change grid features</h4>
          <FormGroup className={classes.filtersWrapper}>
            {Object.keys(enabledFeatures).map(feature => (
              <FormControlLabel
                key={feature}
                control={
                  <Switch
                    checked={enabledFeatures[feature].enabled}
                    onChange={handleChange(feature)}
                    value={feature}
                  />
                }
                label={enabledFeatures[feature].title}
              />
            ))}
          </FormGroup>
        </FormControl>

        <Grid rows={rows} columns={columns}>
          <FilteringState />
          <SortingState />
          <SelectionState />
          {enabledFeatures.grouping.enabled && <GroupingState />}
          <PagingState />
          {enabledFeatures.grouping.enabled && <IntegratedGrouping />}
          {enabledFeatures.filtering.enabled && <IntegratedFiltering />}
          {enabledFeatures.sorting.enabled && <IntegratedSorting />}
          {enabledFeatures.paging.enabled && <IntegratedPaging />}
          {enabledFeatures.selection.enabled && <IntegratedSelection />}
          <DragDropProvider />
          <Table
            columnExtensions={tableColumnExtensions}
          />
          {enabledFeatures.selection.enabled && <TableSelection />}
          {enabledFeatures.columnResizing.enabled && (
            <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
          )}
          <TableHeaderRow
            showSortingControls={enabledFeatures.sorting.enabled}
          />
          {enabledFeatures.filtering.enabled && <TableFilterRow />}
          {enabledFeatures.columnVisibility.enabled && (
            <TableColumnVisibility />
          )}
          <TableColumnReordering />
          {enabledFeatures.paging.enabled && <PagingPanel />}
          {enabledFeatures.grouping.enabled && <TableGroupRow />}
          {enabledFeatures.fixedColumns.enabled && (
            <TableFixedColumns
              leftColumns={["product", "region"]}
              rightColumns={["shipped"]}
            />
          )}
          <Toolbar />
          {enabledFeatures.columnVisibility.enabled && <ColumnChooser />}
          {enabledFeatures.grouping.enabled && (
            <GroupingPanel
              showSortingControls={enabledFeatures.sorting.enabled}
            />
          )}
        </Grid>
      </Paper>
    </Box>
  );
};
