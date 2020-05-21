import React from "react";
import ReactDOM from "react-dom";
import { Cascader, version } from "antd";
import "antd/dist/antd.css";
import provinces from "china-division/dist/provinces.json";
import cities from "china-division/dist/cities.json";
import areas from "china-division/dist/areas.json";


export default class ChinaDivisionSellector extends React.Component{

render(){

    areas.forEach(area => {
        const matchCity = cities.filter(city => city.code === area.cityCode)[0];
        if (matchCity) {
          matchCity.children = matchCity.children || [];
          matchCity.children.push({
            label: area.name,
            value: area.code
          });
        }
      });
      
      cities.forEach(city => {
        const matchProvince = provinces.filter(
          province => province.code === city.provinceCode
        )[0];
        if (matchProvince) {
          matchProvince.children = matchProvince.children || [];
          matchProvince.children.push({
            label: city.name,
            value: city.code,
            children: city.children
          });
        }
      });
      
    const options = provinces.map(province => ({
        label: province.name,
        value: province.code,
        children: province.children
      }));

    return(  
                  <Cascader
                    options={options}
                    // showSearch
                    placeholder="请选择收货所在区域"
                    style={{ width: 300 }}
                   />
            
      )
   }

}







