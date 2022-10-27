import { useState } from "react";
import "./App.css";
import Axios from "axios";
import { Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Results from "./components/Results";

function App() {
  const [countriesByContinent, setCountriesByContinent] = useState(null);
  const [allCountries, setAllCountries] = useState(null);
  const [continent, setContinent] = useState("ALL");
  const [metric, setMetric] = useState("ALL");
  const [max, setMax] = useState(5);

  // We want countries to be in alphabetical order
  function sortingCountries(a, b) {
    const nameA = a.countryName.toUpperCase();
    const nameB = b.countryName.toUpperCase();
    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
  }

  function selectProperties(objectArray) {
    // first we keep the important properties and we sort the objects by countryName
    return objectArray.map((country) => {
      return {
        countryName: country.countryName,
        population: country.population,
        areaInSqKm: country.areaInSqKm,
        continentName: country.continentName,
      }
    }).sort(sortingCountries);
  }

  function groupBy(objectArray, property) {
    // Group countries depending on their continent
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      const curGroup = acc[key] ?? [];

      return { ...acc, [key]: [...curGroup, obj] };
    }, {});
  }

  async function loadGeoNames() {
    try {
      const response = await Axios({
        method: 'GET',
        url: `http://api.geonames.org/countryInfoJSON?formatted=true&username=hydrane`
      });
      if (response.status !== 200) return console.error('ERROR');
      // Filtering our data to keep the essential information
      setAllCountries(selectProperties(response.data.geonames));
      const filteredData = selectProperties(response.data.geonames, "continentName")
      setCountriesByContinent(groupBy(filteredData, "continentName"));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Frontend Dev CS</h1>
        <Button
          className="app-button"
          onClick={() => {
            loadGeoNames();
          }}
          variant="contained"
        >Go</Button>
      </header>
      <section className="app-filters">
        <FormControl sx={{ m: 1, minWidth: 120 }} disabled={!countriesByContinent}>
          <InputLabel id="continent">Continent</InputLabel>
          <Select
            labelId="continent"
            id="continent"
            defaultValue="ALL"
            value={continent}
            label="Continent"
            onChange={(event) => {
              setContinent(event.target.value);
            }}
          >
            <MenuItem value="ALL">ALL</MenuItem>
            {countriesByContinent && Object.keys(countriesByContinent).map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }} disabled={!countriesByContinent}>
          <InputLabel id="metric">Metric</InputLabel>
          <Select
            labelId="metric"
            id="metric"
            defaultValue="ALL"
            value={metric}
            label="metric"
            onChange={(event) => {
              setMetric(event.target.value);
            }}
          >
            <MenuItem value="ALL">ALL</MenuItem>
            <MenuItem value="areaInSqKm">AreaInSqKm</MenuItem>
            <MenuItem value="population">Population</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }} disabled={!countriesByContinent}>
          <InputLabel id="max">Max</InputLabel>
          <Select
            labelId="max"
            id="max"
            defaultValue={5}
            value={max}
            label="Max"
            onChange={(event) => {
              setMax(event.target.value);
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </section>
      {countriesByContinent && <Results countriesByContinent={countriesByContinent} continent={continent} metric={metric} max={max} allCountries={allCountries} />}
    </div>
  );
}

export default App;
