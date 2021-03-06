import GeoJSON from "geojson";
import { RestaurantService } from "./restaurantService.mjs";
import { Country } from "../db/index.mjs";
import fs from "fs";

class MapService {
  //geojson 세계지도 국가별 마커
  static async getWorldGeoMarker() {
    let ret = await Country.getAllCountry();

    //for문 너무 어지럽게 써서 깔끔하게 줄이고 싶네요
    for (let i = 0; i < ret.length; i += 10) {
      let arr = [];
      for (let j = 0; j < 10; j++) {
        if (i + j < ret.length) {
          arr.push(
            RestaurantService.countRestaurantByCountry(ret[i + j].nation),
          );
        }
      }
      let c = await Promise.all(arr);
      for (let j = 0; j < 10; j++) {
        if (i + j < ret.length) {
          ret[i + j]["count"] = c[j];
        }
      }
    }
    return GeoJSON.parse(ret, { Point: ["lat", "lng"] });
  }

  //그냥 json으로
  static async getWorldMarker() {
    let ret = await Country.getAllCountry();

    for (let i = 0; i < ret.length; i += 10) {
      let arr = [];
      for (let j = 0; j < 10; j++) {
        if (i + j < ret.length) {
          arr.push(
            RestaurantService.countRestaurantByCountry(ret[i + j].nation),
          );
        }
      }
      let c = await Promise.all(arr);
      for (let j = 0; j < 10; j++) {
        if (i + j < ret.length) {
          ret[i + j]["count"] = c[j];
        }
      }
    }

    return ret;
  }

  //특정 국가 마커 geojson으로 반환
  static async getCountryMarker(country) {
    let ret = await RestaurantService.getRestaurantsByCountry({
      country,
    });
    console.log(ret);
    return GeoJSON.parse(ret, { Point: ["latitude", "longitude"] });
  }

  //특정 국가 마커 페이지네이션
  static async getCountryMarkerPage({ country, page, pageSize }) {
    let ret = await RestaurantService.getRestaurantsByCountryPaging({
      country,
      page,
      pageSize,
    });
    const lastPage = ret.lastPage;
    ret = GeoJSON.parse(ret, { Point: ["latitude", "longitude"] });
    ret.lastPage = lastPage;
    return ret;
  }

  //국가 국경선
  static async getCountryBorder(country) {
    const jsonFile = await fs.promises.readFile("world_geo.json");
    const data = JSON.parse(jsonFile);
    for (let i = 0; i < data.length; i++) {
      if (data[i].properties.name === country) {
        return data[i];
      }
    }
  }
}

export { MapService };
