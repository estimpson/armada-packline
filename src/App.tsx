import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import parseISO from 'date-fns/parseISO';

interface ILocalApiDetails {
    port: string;
    signingKey: string;
}

declare const window: Window &
    typeof globalThis & {
        electron?: {
            versions: {
                node: string;
            };
            send: (channel: string, data?: any) => void;
            receive: (channel: string, func: any) => void;
        };
    };

const electron = window?.electron;
const versions = window?.electron ? window.electron.versions : undefined;

interface IWeatherForecast {
    date: Date;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

function getWeatherForecasts(
    localApiDetails: ILocalApiDetails,
    setResult: (results: Array<IWeatherForecast>) => void,
) {
    let queryString = `http://localhost:${localApiDetails.port}/WeatherForecast`;
    let customHeaders = {
        headers: {
            Accept: 'application/json, text/plain, */*',
            'x-signing-key': localApiDetails.signingKey,
        },
    };
    axios
        .get<IWeatherForecast[]>(queryString, customHeaders)
        .then((response) => {
            setResult(
                response.data.map((weatherForecast) => {
                    weatherForecast.date = parseISO(
                        weatherForecast.date.toString(),
                    );
                    return weatherForecast;
                }),
            );
        })
        .catch((ex) => console.log(`${ex} - ${queryString}`));
}

function App() {
    const [localApiDetails, setLocalApiDetails] = useState<
        ILocalApiDetails | undefined
    >(undefined);
    const [weatherForecasts, setWeatherForecasts] =
        useState<IWeatherForecast[]>();

    useEffect(() => {
        if (!localApiDetails) {
            if (electron) {
                electron.receive('api-details', (data: string) => {
                    console.log(`Received ${data} about dotnet api`);
                    setLocalApiDetails(JSON.parse(data));
                });
                electron.receive('api-details-error', (err: string) => {
                    console.log(
                        `Received ${
                            err ? err : '[no error details]'
                        } about dotnet api`,
                    );
                });
                electron.send('get-api-details');
            }
        }
    }, [localApiDetails]);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <button
                    onClick={() => {
                        if (localApiDetails)
                            getWeatherForecasts(
                                localApiDetails,
                                setWeatherForecasts,
                            );
                    }}
                >
                    Let's see the weather
                </button>
                {weatherForecasts ? (
                    <>
                        <p>Local Weather</p>
                        {/* {weatherForecasts.map((weatherForecast) => (
                            <p>{weatherForecast.date}</p>
                        ))} */}
                        <ul>
                            {weatherForecasts.map((weatherForecast) => (
                                <li key={weatherForecast.date.getDay()}>
                                    {weatherForecast.date.toDateString()} :{' '}
                                    {weatherForecast.summary}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <></>
                )}
                {localApiDetails ? (
                    <>
                        <p>Local API</p>
                        <ul>
                            {Object.entries(localApiDetails).map(
                                ([key, value]) => (
                                    <li key={key}>
                                        {key} : {value}
                                    </li>
                                ),
                            )}
                        </ul>
                    </>
                ) : (
                    <></>
                )}
                {versions ? (
                    <>
                        <p>Versions</p>
                        <ul>
                            {Object.entries(versions).map(([key, value]) => (
                                <li key={key}>
                                    {key} : {value}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <></>
                )}
            </header>
        </div>
    );
}

export default App;
