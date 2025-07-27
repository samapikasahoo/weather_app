type WeatherResponse record {
    Location location;
    Current current;
};

type Location record {
    string name;
    string region;
    string country;
    decimal lat;
    decimal lon;
    string tz_id;
    int localtime_epoch;
    string localtime;
};

type Current record {
    int last_updated_epoch;
    string last_updated;
    decimal temp_c;
    decimal temp_f;
    int is_day;
    Condition condition;
    decimal wind_mph;
    decimal wind_kph;
    int wind_degree;
    string wind_dir;
    decimal pressure_mb;
    decimal pressure_in;
    decimal precip_mm;
    decimal precip_in;
    int humidity;
    int cloud;
    decimal feelslike_c;
    decimal feelslike_f;
    decimal windchill_c;
    decimal windchill_f;
    decimal heatindex_c;
    decimal heatindex_f;
    decimal dewpoint_c;
    decimal dewpoint_f;
    decimal vis_km;
    decimal vis_miles;
    decimal uv;
    decimal gust_mph;
    decimal gust_kph;
    AirQuality air_quality?;
};

type AirQuality record {
    decimal co;
    decimal no2;
    decimal o3;
    decimal so2;
    decimal pm2_5;
    decimal pm10;
};

type Condition record {
    string text;
    string icon;
    int code;
};

type ForecastResponse record {
    Location location;
    Current current;
    Forecast forecast;
};

type Forecast record {
    ForecastDay[] forecastday;
};

type ForecastDay record {
    string date;
    int date_epoch;
    Day day;
    Astro astro;
    Hour[] hour;
};

type Day record {
    decimal maxtemp_c;
    decimal maxtemp_f;
    decimal mintemp_c;
    decimal mintemp_f;
    decimal avgtemp_c;
    decimal avgtemp_f;
    decimal maxwind_mph;
    decimal maxwind_kph;
    decimal totalprecip_mm;
    decimal totalprecip_in;
    decimal totalsnow_cm?;
    decimal avgvis_km;
    decimal avgvis_miles;
    decimal avghumidity;
    int daily_will_it_rain?;
    int daily_chance_of_rain?;
    int daily_will_it_snow?;
    int daily_chance_of_snow?;
    Condition condition;
    decimal uv;
};

type Astro record {
    string sunrise;
    string sunset;
    string moonrise;
    string moonset;
    string moon_phase;
    int moon_illumination;
    int is_moon_up?;
    int is_sun_up?;
};

type Hour record {
    int time_epoch;
    string time;
    decimal temp_c;
    decimal temp_f;
    int is_day;
    Condition condition;
    decimal wind_mph;
    decimal wind_kph;
    int wind_degree;
    string wind_dir;
    decimal pressure_mb;
    decimal pressure_in;
    decimal precip_mm;
    decimal precip_in;
    int humidity;
    int cloud;
    decimal feelslike_c;
    decimal feelslike_f;
    decimal windchill_c;
    decimal windchill_f;
    decimal heatindex_c;
    decimal heatindex_f;
    decimal dewpoint_c;
    decimal dewpoint_f;
    int will_it_rain?;
    int chance_of_rain?;
    int will_it_snow?;
    int chance_of_snow?;
    decimal vis_km;
    decimal vis_miles;
    decimal gust_mph;
    decimal gust_kph;
    decimal uv;
};

type FutureResponse record {
    Location location;
    Forecast forecast;
};

type MarineResponse record {
    Location location;
    Forecast forecast;
};

type MarineForecast record {
    MarineForecastDay[] forecastday;
};

type MarineForecastDay record {
    string date;
    int date_epoch;
    MarineDay day;
    Astro astro;
    MarineHour[] hour;
};

type MarineDay record {
    decimal maxtemp_c;
    decimal maxtemp_f;
    decimal mintemp_c;
    decimal mintemp_f;
    decimal avgtemp_c;
    decimal avgtemp_f;
    decimal maxwind_mph;
    decimal maxwind_kph;
    decimal totalprecip_mm;
    decimal totalprecip_in;
    decimal totalsnow_cm?;
    decimal avgvis_km;
    decimal avgvis_miles;
    decimal avghumidity;
    decimal uv;
    MarineCondition condition;
};

type MarineCondition record {
    string text;
    string icon;
    int code;
};

type MarineHour record {
    int time_epoch;
    string time;
    decimal temp_c;
    decimal temp_f;
    decimal wind_mph;
    decimal wind_kph;
    int wind_degree;
    string wind_dir;
    decimal pressure_mb;
    decimal pressure_in;
    decimal precip_mm;
    decimal precip_in;
    decimal significant_wave_height;
    decimal swell_wave_height;
    decimal swell_wave_direction;
    decimal swell_wave_period;
    decimal water_temp_c;
    decimal water_temp_f;
};

type AstronomyResponse record {
    Location location;
    Astronomy astronomy;
};

type Astronomy record {
    Astro astro;
};

type GeminiContent record {
    GeminiPart[] parts;
};

type GeminiPart record {
    string text;
};

type GeminiResponse record {
    GeminiCandidate[] candidates;
};

type GeminiCandidate record {
    GeminiContent content;
};

type GeoCode record {
    string place_id;
    string licence;
    string osm_type;
    string osm_id;
    string lat;
    string lon;
    string display_name;
    Address address;
    string[] boundingbox;
};

type Address record {
    string restaurant?;
    string road?;
    string hamlet?;
    string suburb?;
    string village?;
    string city?;
    string state_district?;
    string state?;
    string postcode?;
    string country?;
    string country_code?;
};
