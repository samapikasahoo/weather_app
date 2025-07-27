import ballerina/data.jsondata;
import ballerina/http;
import ballerina/io;
import ballerina/test;

@test:Mock {functionName: "initializeOpenWeatherClient"}
function mockInitializeOpenWeatherClient() returns http:Client|error {
    http:Client mockClient = test:mock(http:Client);
    json jsonResponse = check io:fileReadJson("./backend/tests/resources/astro-res.json");
    AstronomyResponse astronomyResponse = check jsondata:parseAsType(jsonResponse);
    test:prepare(mockClient)
        .whenResource("::pathparam")
        .withPathParameters({pathparam: ["astronomy.json"]})
        .onMethod("get")
        .thenReturn(astronomyResponse);
    jsonResponse = check io:fileReadJson("./backend/tests/resources/weather-res.json");
    WeatherResponse weatherResponse = check jsondata:parseAsType(jsonResponse);
    test:prepare(mockClient)
        .whenResource("::pathparam")
        .withPathParameters({pathparam: ["current.json"]})
        .onMethod("get")
        .thenReturn(weatherResponse);
    jsonResponse = check io:fileReadJson("./backend/tests/resources/forecast-res.json");
    ForecastResponse forecastResponse = check jsondata:parseAsType(jsonResponse);
    test:prepare(mockClient)
        .whenResource("::pathparam")
        .withPathParameters({pathparam: ["forecast.json"]})
        .onMethod("get")
        .thenReturn(forecastResponse);
    jsonResponse = check io:fileReadJson("./backend/tests/resources/future-res.json");
    FutureResponse futureResponse = check jsondata:parseAsType(jsonResponse);
    test:prepare(mockClient)
        .whenResource("::pathparam")
        .withPathParameters({pathparam: ["future.json"]})
        .onMethod("get")
        .thenReturn(futureResponse);
    jsonResponse = check io:fileReadJson("./backend/tests/resources/marine-res.json");
    MarineResponse marineResponse = check jsondata:parseAsType(jsonResponse);
    test:prepare(mockClient)
        .whenResource("::pathparam")
        .withPathParameters({pathparam: ["marine.json"]})
        .onMethod("get")
        .thenReturn(marineResponse);
    return mockClient;
}

@test:Mock {functionName: "initializeGeminiClient"}
function mockInitializeGeminiClient() returns http:Client|error {
    http:Client mockClient = test:mock(http:Client);
    GeminiResponse geminiResponse = {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": "Take an umbrella with you when you go out in London today, as it is expected to rain."
                        }
                    ]
                }
            }
        ]
    };

    test:prepare(mockClient)
        .whenResource("::pathparam")
        .withPathParameters({pathparam: ["v1beta", "models", "gemini-2.0-flash:generateContent"]})
        .onMethod("post")
        .thenReturn(geminiResponse);
    return mockClient;
}

@test:Mock {functionName: "initializeLocationIQClient"}
function mockInitializeLocationIQClient() returns http:Client|error {
    http:Client mockClient = test:mock(http:Client);
    json jsonResponse = check io:fileReadJson("./backend/tests/resources/geo-res.json");
    GeoCode geoCodeResponse = check jsondata:parseAsType(jsonResponse);
    test:prepare(mockClient)
        .whenResource("::pathparam")
        .withPathParameters({pathparam: ["reverse"]})
        .onMethod("get")
        .thenReturn(geoCodeResponse);
    return mockClient;
}

@test:Config {}
function testCurrentWeather() returns error? {
    http:Client testClient = check new ("http://localhost:9090");
    WeatherResponse response = check testClient->/currentWeather(city = "London");
    test:assertEquals(response.location.name, "London");
    test:assertEquals(response.current.temp_c, 18.5d);
}

@test:Config {}
function testForecast() returns error? {
    http:Client testClient = check new ("http://localhost:9090");
    ForecastResponse response = check testClient->/forecast(city = "London", days = 1);
    test:assertEquals(response.location.name, "London");
    test:assertEquals(response.forecast.forecastday[0].day.maxtemp_c, 30.0d);
}

@test:Config {}
function testFutureWeather() returns error? {
    http:Client testClient = check new ("http://localhost:9090");
    FutureResponse response = check testClient->/futureWeather(city = "London", date = "2023-06-25");
    test:assertEquals(response.location.name, "London");
}

@test:Config {}
function testMarineWeather() returns error? {
    http:Client testClient = check new ("http://localhost:9090");
    MarineResponse response = check testClient->/marineWeather(city = "London", days = 1);
    test:assertEquals(response.location.name, "London");
}

@test:Config {}
function testAstronomy() returns error? {
    http:Client testClient = check new ("http://localhost:9090");
    AstronomyResponse response = check testClient->/astronomy(city = "London", date = "2023-06-19");
    test:assertEquals(response.location.name, "London");
    test:assertEquals(response.astronomy.astro.sunrise, "04:43 AM");
}

@test:Config {}
function testCurrentWeatherSummary() returns error? {
    http:Client testClient = check new ("http://localhost:9090");
    string response = check testClient->/currentWeatherSummary(city = "London");
    test:assertEquals(response, "Take an umbrella with you when you go out in London today, as it is expected to rain.");
}

@test:Config {}
function testReverseGeocode() returns error? {
    http:Client testClient = check new ("http://localhost:9090");
    GeoCode response = check testClient->/reverseGeocode(lat = 6.9321557, lon = 79.8479562);
    test:assertEquals(response.lat, "6.9321557");
    test:assertEquals(response.lon, "79.8479562");
    test:assertEquals(response.address.state_district, "Colombo District");
}
