import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from "@mui/material";
import Highcharts from "highcharts/highstock";
import PieChart from "highcharts-react-official";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface IProps {
  allCountries: {
    countryName: string,
    population: string,
    areaInSqKm: string,
    continentName: string,
  }[],
  countriesByContinent: {
    [key: string]: IProps["allCountries"],
  },
  continent: string,
  metric: string,
  max: string,
}

interface IState {
  country: {
    countryName: string,
    population: string,
    areaInSqKm: string,
    continentName: string,
  },
}

function Results({ countriesByContinent, continent, metric, max, allCountries }: IProps) {
  // display the countries based on the continent selected, and apply the maximum value chosen
  const displayedContinent: IProps["allCountries"] = continent === "ALL" ? allCountries.slice(0, parseInt(max)) : countriesByContinent[continent].slice(0, parseInt(max));
  const others = continent === "ALL" ? allCountries.slice(parseInt(max)) : countriesByContinent[continent].slice(parseInt(max));

  // Computing the total of "population" and "areaInSqKm"
  function computeTotal(array: object[], property: string) {
    const filtered = array.map((el) => parseInt(el[property as keyof typeof el], 10));
    return filtered.reduce((previous, current) => previous + current, 0)
  }

  function tranformData(property: string) {
    let pieData = displayedContinent.map((country: IState["country"]) => {
      return {
        y: parseInt(country[property as keyof typeof country]),
        name: country.countryName,
      }
    })
    if (others.length > 0) {
      pieData = [...pieData, { y: computeTotal(others, "population"), name: "OTHERS" }]
    }
    return pieData
  }

  // options of our pie chart : population
  const optionsPopulation = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Population"
    },
    series: [
      {
        data: tranformData("population")
      }
    ]
  };

  // options of our pie chart : areaInSqKm
  const optionsAreaInSqKm = {
    chart: {
      type: "pie",
    },
    title: {
      text: "AreaInSqKm"
    },
    series: [
      {
        data: tranformData("areaInSqKm")
      }
    ]
  };

  return (
    <section className="results">
      <div className="results-pie">
        {(metric === "ALL" || metric === "population") && <PieChart highcharts={Highcharts} options={optionsPopulation} />}
        {(metric === "ALL" || metric === "areaInSqKm") && <PieChart highcharts={Highcharts} options={optionsAreaInSqKm} />}
      </div>
      <TableContainer>
        <Table sx={{ maxWidth: 750, margin: "0 auto" }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>continentName</StyledTableCell>
              <StyledTableCell align="right">countryName</StyledTableCell>
              {(metric === "ALL" || metric === "population") && <StyledTableCell align="right">population</StyledTableCell>}
              {(metric === "ALL" || metric === "areaInSqKm") && <StyledTableCell align="right">areaInSqKm</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedContinent.map((country) => (
              <StyledTableRow key={country.countryName}>
                <StyledTableCell component="th" scope="row">
                  {country.continentName}
                </StyledTableCell>
                <StyledTableCell align="right">{country.countryName}</StyledTableCell>
                {(metric === "ALL" || metric === "population") && <StyledTableCell align="right">{country.population}</StyledTableCell>}
                {(metric === "ALL" || metric === "areaInSqKm") && <StyledTableCell align="right">{country.areaInSqKm}</StyledTableCell>}
              </StyledTableRow>
            ))}
            <StyledTableRow key="total">
              <StyledTableCell component="th" scope="row">
              </StyledTableCell>
              <StyledTableCell align="right">TOTAL</StyledTableCell>
              {(metric === "ALL" || metric === "population") && <StyledTableCell align="right">{computeTotal(displayedContinent, "population")}</StyledTableCell>}
              {(metric === "ALL" || metric === "areaInSqKm") && <StyledTableCell align="right">{computeTotal(displayedContinent, "areaInSqKm")}</StyledTableCell>}
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}

export default Results;
