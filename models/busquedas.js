const fs = require('fs')
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json'

    constructor() {
        // TODO: leer DB si existe.
        this.leerDB();
    }

    get historialCapitalizado(){
        let capital = []
        this.historial.forEach( elem => {
            capital.push(elem.toUpperCase())
        })
        return capital;
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
        }
    }

    get paramsWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }

    async ciudad(lugar = '') {
        try {
            // peticion HTTP
            const instace = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })
            const resp = await instace.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {
            return []; // retorna lo lugares que coincidan con mi busqueda

        }
    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon },
            });
            const resp = await instance.get();
            const { weather, main } = resp.data;
            // console.log(resp.data);

            return {
                descripCielo: weather[0].description,
                tempActual: main.temp,
                tempMax: main.temp_max,
                tempMin: main.temp_min,
            }
        } catch (error) {
            return [];
        }
    }

    agregarHistorial(lugar = '') {

        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }

        this.historial.splice(0,5)

        this.historial.unshift(lugar.toLowerCase()); //
        this.guardarDB();

    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (fs.existsSync(this.dbPath)) {
            const info = fs.readFileSync(this.dbPath, { encoding: 'UTF-8' });
            const data = JSON.parse(info);   
            this.historial = data.historial;
        }        
    }

}




module.exports = Busquedas;